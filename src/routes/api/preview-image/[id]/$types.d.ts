import type * as Kit from '@sveltejs/kit';

export type RouteParams = {
	id: string;
};

export type RequestHandler = Kit.RequestHandler<RouteParams, {}>;

export type RequestEvent = Kit.RequestEvent<RouteParams, {}>;