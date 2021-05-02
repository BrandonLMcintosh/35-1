const express = require("express");
const db = require("../db");
const slugify = require("slugify");
const router = new express.Router();

router.get("", async (req, res, next) => {
	try {
		const result = await db.query(
			`SELECT * 
				FROM companies AS c
				LEFT JOIN companies_industries as ci
				ON c.code = ci.company_code
				LEFT JOIN industries AS i
				ON ci.industry_code = i.code`
		);
		return res.json({
			companies: result.rows,
		});
	} catch (err) {
		next(err);
	}
});

router.post("", async (req, res, next) => {
	try {
		const { name, description, industryCodes = [] } = req.body;

		const code = slugify(name);
		const requests = [];
		const addCompany = db.query(
			`INSERT INTO companies
            (code, name, description)
            VALUES
            ($1,$2,$3)`,
			[code, name, description]
		);

		requests.push(addCompany);

		industryCodes.forEach((industryCode) => {
			const combineIndustry = db.query(
				`
			INSERT INTO companies_industries
			(industry_code, company_code)
			VALUES
			($1, $2)`,
				[industryCode, code]
			);
			requests.push(combineIndustry);
		});

		const getCompany = await db.query(
			`SELECT * 
				FROM companies AS c
				LEFT JOIN companies_industries as ci
				ON c.code = ci.company_code
				LEFT JOIN industries AS i
				ON ci.industry_code = i.code
			WHERE c.name = $1`,
			[name]
		);

		requests.push(getCompany);

		await Promise.all(requests);

		res.json({
			added_company: getCompany.rows[0],
		});
	} catch (err) {
		next(err);
	}
});

router.get("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		const result = await db.query(
			`SELECT c.name, c.description, i.industry
				FROM companies AS c
				RIGHT JOIN companies_industries as ci
				ON c.code = ci.company_code
				RIGHT JOIN industries AS i
				ON ci.industry_code = i.code
			WHERE c.code = $1`,
			[code]
		);
		const { name, description } = result.rows[0];
		const industries = result.rows.map((row) => row.industry);
		return res.json({ name, description, industries });
	} catch (err) {
		next(err);
	}
});

router.patch("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		const { name, description, industries = [] } = req.body;
		const requests = [];
		const modifyCompany = db.query(
			`UPDATE companies SET name=$1, description=$2
            WHERE code=$3`,
			[name, description, code]
		);
		requests.push(modifyCompany);

		industries.forEach((industryCode) => {
			const addIndustry = db.query(
				`INSERT INTO industries
				(industry_code, company_code)
				VALUES
				($1, $2)`,
				[industryCode, code]
			);
			requests.push(addIndustry);
		});

		const getCompany = await db.query(
			`SELECT * 
				FROM companies AS c
				LEFT JOIN companies_industries as ci
				ON c.code = ci.company_code
				LEFT JOIN industries AS i
				ON ci.industry_code = i.code
			WHERE c.name = $1`,
			[code]
		);
		return res.json({
			updated_company: getCompany.rows[0],
		});
	} catch (err) {
		next(err);
	}
});

router.delete("/:code", async (req, res, next) => {
	try {
		const code = req.params.code;
		await db.query(
			`DELETE FROM companies
            WHERE code=$1`,
			[code]
		);
		return res.json({
			deleted_company: code,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
