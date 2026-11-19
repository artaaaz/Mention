import { createContext, useContext } from "react";

/**
 * ready : true setelah splash selesai → halaman boleh memutar animasi masuk
 * go(to): pindah halaman dengan transisi slide-blur
 */
export const AppContext = createContext({ ready: false, go: () => {} });

export const useApp = () => useContext(AppContext);

// Splash menunggu scene 3D beranda siap (maks. 2,5 dtk) sebelum menutup.
let resolveScene;
export const sceneReady = new Promise((resolve) => (resolveScene = resolve));
export const markSceneReady = () => resolveScene();
