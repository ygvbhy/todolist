import './style.css';
import App from './app';

const el = document.querySelector<HTMLDivElement>('#app') as HTMLDivElement;

const app = App(el);
app.init();
