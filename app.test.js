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
		expect(res.statusCode).toBe(200);
	});

	test("POST /companies", async () => {
		const res = await request(app).post("/companies").send(companyTest);
		expect(res.statusCode).toBe(200);
	});

	test("GET /companies/:code", async () => {
		const res = await request(app).get(`/companies/`);
		expect(res.statusCode).toBe(200);
	});

	test("PATCH /companies/:code", async () => {
		const res = await request(app).patch(`/companies/${companyTest.code}`).send({
			name: "test1_name_edited",
			description: "test1_description_edited",
		});
		expect(res.statusCode).toBe(200);
	});

	test("DELETE /companies/:code", async () => {
		const res = await request(app).delete(`/companies/${companyTest.code}`);
		expect(res.statusCode).toBe(200);
	});
});

describe("/invoices route", () => {
	test("GET /invoices", async () => {
		const res = await request(app).get("/invoices");
		expect(res.statusCode).toBe(200);
	});

	test("POST /invoices", async () => {
		const res = await request(app).post("/invoices").send(invoiceTest);
		expect(res.statusCode).toBe(200);
	});

	test("GET /invoices/:id", async () => {
		const res = await request(app).get(`/invoices/${invoiceTest.id}`);
		expect(res.statusCode).toBe(200);
	});

	test("PATCH /invoices/:id", async () => {
		const res = await request(app).patch(`/invoices/${invoiceTest.id}`).send({
			amt: 10001,
			paid: true,
		});
	});

	test("DELETE /invoices/:id", async () => {
		const res = await request(app).delete(`/invoices/${invoiceTest.id}`);
		expect(res.statusCode).toBe(200);
	});
});
