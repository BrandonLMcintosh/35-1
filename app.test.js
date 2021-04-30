process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");

let companyTest;
let invoiceTest;

beforeEach(() => {
	companyTest = {
		code: "test1",
		name: "test1_name",
		description: "test1_description",
	};
	invoiceTest = {};
});

afterEach(() => {});

describe("/companies route", () => {
	test("GET /companies", async () => {
		const res = await request(app).get("/companies");
		console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("POST /companies", async () => {
		const res = await request(app).post("/companies").send(companyTest);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("GET /companies/:code", async () => {
		const res = await request(app).get(`/companies/`);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("PATCH /companies/:code", async () => {
		const res = await request(app).patch(`/companies/${companyTest.code}`).send({
			name: "test1_name_edited",
			description: "test1_description_edited",
		});
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("DELETE /companies/:code", async () => {
		const res = await request(app).delete(`/companies/${companyTest.code}`);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});
});

describe("/invoices route", () => {
	test("GET /invoices", async () => {
		const res = await request(app).get("/invoices");
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("POST /invoices", async () => {
		const res = await request(app).post("/invoices").send(invoiceTest);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("GET /invoices/:id", async () => {
		const res = await request(app).get(`/invoices/${invoiceTest.id}`);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("PATCH /invoices/:id", async () => {
		const res = await request(app).patch(`/invoices/${invoiceTest.id}`).send({
			amt: 10001,
			paid: true,
		});
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});

	test("DELETE /invoices/:id", async () => {
		const res = await request(app).delete(`/invoices/${invoiceTest.id}`);
		// console.log(res);
		expect(res.statusCode).toBe(200);
	});
});
