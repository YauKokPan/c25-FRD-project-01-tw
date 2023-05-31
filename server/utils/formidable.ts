import express from 'express'
import formidable, { Fields, Files } from 'formidable'
import IncomingForm from 'formidable/Formidable'

export function parse(form: IncomingForm, req: express.Request) {
	return new Promise<[fields: Fields, files: Files]>((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				reject(err)
			} else {
				resolve([fields, files])
			}
		})
	})
}


export const form = formidable({
	//formData
	uploadDir: 'public/upload',
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
	filter: (part) => part.mimetype?.startsWith('image/') || false,
	filename: (originalName, originalExt, part) => {
		let timestamp = Date.now()
		let ext = part.mimetype?.split('/').pop()
		return `image-${timestamp}.${ext}`
	}
})
