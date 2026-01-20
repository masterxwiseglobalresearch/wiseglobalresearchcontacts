import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';

let _registered = false;

export default function registerChartOnce() {
  if (_registered) return;
  try {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
    _registered = true;
  } catch (e) {
    _registered = true;
  }
}
