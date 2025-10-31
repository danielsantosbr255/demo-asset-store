import { UAParser } from "ua-parser-js";

export const getUserAgent = (user_agent: string) => {
	const ua = UAParser(user_agent);

	const os = ua.os.name ? `${ua.os.name} ${ua.os.version}`.trim() : "Desconhecido";
	const browser = ua.browser.name ? `${ua.browser.name}`.trim() : "Desconhecido";
	const device = ua.device.vendor ?? ua.device.model ?? ua.device.type ?? "Desktop";

	return { os, browser, device };
};
