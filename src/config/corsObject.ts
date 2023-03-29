const corsObject = {
	origin: ["http://localhost:3000", "http://localhost:3001"],
	methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "HEAD", "DELETE"],
	credentials: true
};

export default corsObject;
