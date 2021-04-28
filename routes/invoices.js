const express = require("express");
const db = require("../db");
const router = new express.Router();

router.get("", async () => {
	try {
		const result = await db.query(`SELECT * FROM invoices`);
		return result.json({
			invoices: result,
		});
	} catch (err) {
		next(err);
	}
});

router.post("", async () => {});

router.get("/:id", async () => {});

router.put("/:id", async () => {});

router.delete("/:id", async () => {});

module.exports = router;
