/// <reference types="vite/client" />
import anime from 'animejs';

declare global {
  interface Window {
    anime: typeof anime;
  }
}
