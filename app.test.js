process.env.NODE_ENV = "test";
const request = require("supertest");
const slugify = require("slugify");

const app = require("./app");

let companyTest;
let invoiceTest;

beforeEach(function () {
	companyTest = {
		name: "test1 name",
		description: "test1_description",
	};
	invoiceTest = {
		id: 1000,
		comp_code: "apple",
		amt: 1000,
	};
});

afterEach(function () {});

describe("/companies route", function () {
	test("GET /companies", async function () {
		const res = await request(app).get("/companies");
		expect(res.statusCode).toBe(200);
	});

	test("POST /companies", async function () {
		const res = await request(app).post("/companies").send(companyTest);
		expect(res.statusCode).toBe(200);
	});

	test("GET /companies/:code", async function () {
		const res = await request(app).get(`/companies/apple`);
		expect(res.statusCode).toBe(200);
		expect(res.body.industries.length).toBe(3);
	});

	test("PATCH /companies/:code", async function () {
		const res = await request(app)
			.patch(`/companies/${slugify(companyTest.name)}`)
			.send({
				name: "test1_name_edited",
				description: "test1_description_edited",
			});
		expect(res.statusCode).toBe(200);
	});

	test("DELETE /companies/:code", async function () {
		const res = await request(app).delete(
			`/companies/${slugify(companyTest.name)}`
		);
		expect(res.statusCode).toBe(200);
	});
});

describe("/invoices route", function () {
	test("GET /invoices", async function () {
		const res = await request(app).get("/invoices");
		expect(res.statusCode).toBe(200);
	});

	test("POST /invoices", async function () {
		const res = await request(app).post("/invoices").send(invoiceTest);
		expect(res.statusCode).toBe(200);
	});

	test("GET /invoices/:id", async function () {
		const res = await request(app).get(`/invoices/${invoiceTest.id}`);
		expect(res.statusCode).toBe(200);
	});

	test("PATCH /invoices/:id", async function () {
		const res = await request(app)
			.patch(`/invoices/${invoiceTest.id}`)
			.send({
				amt: 10001,
				paying: true,
			});
		expect(res.statusCode).toBe(200);
	});

	test("DELETE /invoices/:id", async function () {
		const res = await request(app).delete(`/invoices/${invoiceTest.id}`);
		expect(res.statusCode).toBe(200);
	});
});
