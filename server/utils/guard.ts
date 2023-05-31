import express from 'express'
import path from 'path'

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		//called Next here
		next()
	} else {
		// redirect to index page
		res.status(404).sendFile(path.resolve('./public/404.html'))
	}
}

export const isLoggedInAPI = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		//called Next here
		next()
	} else {
		// redirect to index page
		res.status(400).json({ error: 'No permission' })
	}
}

export const isAdmin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user?.is_admin == true) {
		//called Next here
		next()
	} else {
		// redirect to index page
		res.status(400).json({ error: 'No permission' })
	}
}
