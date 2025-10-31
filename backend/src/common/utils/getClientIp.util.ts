import type { Request } from "express";

const isValidIp = (ip: string) => {
	const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
	const ipv6Regex =
		/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}:[0-9a-fA-F]{1,4}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9])\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9])\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]))$/;

	return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

export const getClientIp = (req: Request) => {
	const forwarded = req.headers["x-forwarded-for"];

	if (forwarded && typeof forwarded === "string") {
		const ips = forwarded.split(",").map((ip) => ip.trim());
		if (ips.length > 0 && isValidIp(ips[0])) {
			return ips[0];
		}
	}

	const socketIp = req.socket?.remoteAddress;
	if (socketIp && isValidIp(socketIp)) {
		return socketIp;
	}

	return "0.0.0.0";
};
