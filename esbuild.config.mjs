import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import chokidar from 'chokidar';
import fs from 'fs/promises';

class Logger {
	getTimeNow() {
		return (new Date(Date.now())).toLocaleTimeString()
	}

	pending(msg) {
		console.log('\x1b[33m%s\x1b[0m', `${this.getTimeNow()} | ⏳ ${msg}`)
	}

	success(msg) {
		console.log('\x1b[32m%s\x1b[0m', `${this.getTimeNow()} | ✔ ${msg}`);
	}

	failed(msg) {
		console.log('\x1b[31m%s\x1b[0m', `${this.getTimeNow()} | ${msg}`);
	}
}

const prod = (process.argv[2] === "production");
const log = new Logger()

async function processCSS() {
	const css = await fs.readFile('src/index.css', 'utf8');
	const result = await postcss([tailwindcss, autoprefixer]).process(css, {
		from: 'src/index.css',
		to: 'styles.css',
	});
	await fs.writeFile('styles.css', result.css);
	if (result.map) {
		await fs.writeFile('styles.css.map', result.map.toString());
	}
}

await processCSS();

const context = await esbuild.context({
	entryPoints: ["main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
});

if (prod) {
	await processCSS();
	await context.rebuild();
	process.exit(0);
} else {
	chokidar.watch(['src/**/*.tsx', 'src/**/*.ts', 'src/index.css']).on('change', async () => {
		log.pending("Building css from tailwind utility classes ...")
		await processCSS();
		log.success("Done")
		log.pending("Building plugin and svelte components ...")
		await context.rebuild();
		log.success("Done")

		const lineLength = 100;
		console.log('-'.repeat(lineLength));
	});
}