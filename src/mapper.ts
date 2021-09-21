export function detectMediaType(type: string): Lib.MediaType {
	switch (type) {
		case "text/html":
			return { fileType: 'HTML', mediaType: 'text/html' };
		case "text/csv":
			return { fileType: 'CSV', mediaType: 'text/csv' };
		case "application/json":
			return { fileType: 'JSON', mediaType: 'application/json' };
		case "application/zip":
			return { fileType: 'ZIP', mediaType: 'application/zip' };
		case "application/vnd.geo+json":
			return { fileType: 'GEOJSON', mediaType: 'application/vnd.geo+json' };
		case "application/vnd.google-earth.kml+xml":
			return { fileType: 'KML', mediaType: 'application/vnd.google-earth.kml+xml' };
		default: {
			return { fileType: 'UNKNOWN', mediaType: 'unknown' };
		}
	}
}
