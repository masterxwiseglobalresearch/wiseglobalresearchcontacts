// Centralized alert message used by AlertBar and Footer
export const ALERT_HI = 'कृपया ध्यान दें प्रिय ग्राहक, आपका भुगतान तभी स्वीकार किया जाएगा जब आप वाइज ग्लोबल रिसर्च वेबसाइट पर दी गई खाता जानकारी का उपयोग करेंगे। हम केवल वाइज ग्लोबल रिसर्च के खातों में किए गए भुगतान ही स्वीकार करते हैं। वाइज ग्लोबल रिसर्च केवल अपने खाते में प्राप्त राशि के लिए सेवाएं प्रदान करने हेतु जिम्मेदार होगा।';
export const ALERT_EN = 'Pay close attention—Dear Client, your payments will be accepted only if you use the account information listed on the Wise Global Research website. We do not accept any payment in any other accounts besides Wise Global Research. Wise Global Research will only be liable to provide services for the amounts received in its account.';
export const ALERT_BILINGUAL = `${ALERT_HI} ${ALERT_EN}`;

const ALERT_MESSAGES = {
  ALERT_HI,
  ALERT_EN,
  ALERT_BILINGUAL,
};

export default ALERT_MESSAGES;
