/* Firebase Cloud Function to email popup form submissions.
 * Fetches data from Realtime Database node `popoForms`, converts to CSV, and emails using SMTP.
 * Requires environment config (set with firebase functions:config:set):
 *   smtp.host="smtp.example.com"
 *   smtp.port="587"
 *   smtp.user="username"
 *   smtp.pass="password"
 *   smtp.secure="false"   // or true for 465
 *   admin.email="admin@example.com" // destination email (comma separated allowed)
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize app only once
if (!admin.apps.length) {
	admin.initializeApp();
}

const db = admin.database();

// Build transporter from functions config
function buildTransporter() {
	const cfg = functions.config();
	if (!cfg.smtp || !cfg.smtp.host) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'SMTP configuration missing. Set functions config smtp.*'
		);
	}
	return nodemailer.createTransport({
		host: cfg.smtp.host,
		port: cfg.smtp.port ? parseInt(cfg.smtp.port, 10) : 587,
		secure: cfg.smtp.secure === 'true' || cfg.smtp.port === '465',
		auth: cfg.smtp.user
			? {
					user: cfg.smtp.user,
					pass: cfg.smtp.pass,
				}
			: undefined,
	});
}

// Helper: convert JSON array to CSV (simple implementation)
function toCSV(rows) {
	if (!rows.length) return '';
	const headers = Object.keys(rows[0]);
	const escape = (v) => {
		if (v == null) return '';
		const s = String(v).replace(/"/g, '""');
		if (/[",\n]/.test(s)) return `"${s}"`;
		return s;
	};
	const lines = [headers.join(',')];
	for (const row of rows) {
		lines.push(headers.map((h) => escape(row[h])).join(','));
	}
	return lines.join('\n');
}

exports.emailPopupSubmissions = functions.https.onCall(async (data, context) => {
	// Optional auth check
	if (!context.auth) {
		throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
	}

	try {
		const snapshot = await db.ref('popoForms').once('value');
		const val = snapshot.val();
		if (!val) {
			return { sent: false, reason: 'No submissions' };
		}
		const list = Object.keys(val)
			.map((k) => ({ id: k, ...val[k] }))
			.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

		const csvRows = list.map((s) => ({
			id: s.id,
			timestamp: s.timestamp,
			name: s.name || '',
			mobile: s.mobile || '',
			city: s.city || '',
			interest: s.interest || '',
		}));

		const csv = toCSV(csvRows);

		const cfg = functions.config();
		const to = (cfg.admin && cfg.admin.email) || data.to;
		if (!to) {
			throw new functions.https.HttpsError(
				'invalid-argument',
				'Destination email not provided (config admin.email or data.to)'
			);
		}

		const transporter = buildTransporter();
		const info = await transporter.sendMail({
			from: cfg.smtp.user || 'no-reply@example.com',
			to,
			subject: data.subject || 'Popup Form Submissions',
			text: 'Attached are the latest popup form submissions.',
			attachments: [
				{
					filename: 'popup_submissions.csv',
					content: csv,
					contentType: 'text/csv',
				},
			],
		});

		return { sent: true, messageId: info.messageId, count: list.length };
	} catch (err) {
		console.error('emailPopupSubmissions error', err);
		if (err instanceof functions.https.HttpsError) throw err;
		throw new functions.https.HttpsError('internal', err.message);
	}
});

// Scheduled function: send submissions at 09:00,12:00,15:00,18:00 Asia/Kolkata and then purge
exports.scheduledEmailPopupSubmissions = functions.pubsub
	.schedule('0 9,12,15,18 * * *') // UTC by default; we'll specify timeZone below
	.timeZone('Asia/Kolkata')
	.onRun(async () => {
		const snapshot = await db.ref('popoForms').once('value');
		const val = snapshot.val();
		if (!val) {
			console.log('No submissions to email at this interval.');
			return null;
		}
		const list = Object.keys(val)
			.map((k) => ({ id: k, ...val[k] }))
			.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
		const csvRows = list.map((s) => ({
			id: s.id,
			timestamp: s.timestamp,
			name: s.name || '',
			mobile: s.mobile || '',
			city: s.city || '',
			interest: s.interest || '',
		}));
		const csv = toCSV(csvRows);
		try {
			const cfg = functions.config();
			const to = cfg.admin && cfg.admin.email;
			if (!to) {
				console.warn('admin.email not set; skipping email send');
				return null;
			}
			const transporter = buildTransporter();
			await transporter.sendMail({
				from: cfg.smtp.user || 'no-reply@example.com',
				to,
				subject: `Popup Submissions Batch (${list.length})`,
				text: 'Attached batch of popup form submissions. They will now be purged from database.',
				attachments: [
					{ filename: 'popup_submissions_batch.csv', content: csv, contentType: 'text/csv' },
				],
			});
			// Purge old records
			await db.ref('popoForms').remove();
			console.log(`Emailed and purged ${list.length} submissions.`);
		} catch (err) {
			console.error('scheduledEmailPopupSubmissions error', err);
		}
		return null;
	});

