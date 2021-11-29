const cliProgress = require('cli-progress');

const Users = require(__basedir + '/db/schema/users')

var rug = require('random-username-generator');
 
rug.setNames(['heart', 'spade', 'diamond', 'clover']);
rug.setSeperator('_');


const limit = concurrency => iterator => {
  const workers = new Array(concurrency);
  return workers.fill(iterator);
};

const run = func => async iterator => {
	for (const item of iterator) {
		await func(item)
	}
};

const asyncTasks = (array, func, concurrency = 1) => {
	var arrayconc = limit(concurrency)(array.values()).map(run(func))
	return arrayconc;
}

module.exports = (app) => {

	app.post('/generate-users', async(req, res) => {
		try {
			const { count } = req.body;
			if(!count) {
				throw 'Count required'
			}
			let userInsert = [];
			for(let i = 0; i < count; i++){
				userInsert.push({ username: rug.generate() });
			}
			let resp = await Users.insertMany(userInsert);

			res.json({
				message: `Successfully inserted ${resp.length} users`
			})
		} catch(err) {
			res.status(500).json({
				message: 'Internal Server Error',
				stack: err.stack
			})
		}
	})

	app.post('/update-manual', async (req, res) => {
		try {
			const { points, num_users, concurrency } = req.body;
			const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

			console.log("=====================================================================")
			console.log('Updating with (Manual Concurrency)...')
			let start = new Date();
			let users = await Users.find().limit(num_users);
			progress.start(users.length, 0);

			const execute = user => new Promise(async (resolve, reject) => {
				try {
					await Users.updateOne({ _id: user._id }, { $inc: { points: points } });
					progress.increment();
				} catch(errEx) {
					console.log("catch error =>>", err.stack || err)
				}
				resolve(true);
			});

			await Promise.all(asyncTasks(users, execute, concurrency));

			progress.stop();
			let end = new Date();
			let elapsed = (end - start) / 1000;

			console.log(`Total Execution time: ${elapsed}s`)

			res.json({
				message: 'Success'
			})
		} catch(err) {
			res.status(500).json({
				message: 'Internal Server Error',
				stack: err.stack
			})
		}
	});

	app.post('/update-raw', async (req, res) => {
		try {
			const { points, num_users } = req.body;
			const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

			console.log("=====================================================================")
			console.log('Updating (Raw Update)...')
			let start = new Date();
			let users = await Users.find().limit(num_users);
			progress.start(users.length, 0);

			for(let user of users) {
				await Users.updateOne({ _id: user._id }, { $inc: { points: points } });
				progress.increment();
			}
			progress.stop();
			let end = new Date();
			let elapsed = (end - start) / 1000
			console.log(`Total Execution time: ${elapsed}s`)

			res.json({
				message: 'Success',
				count: users.length
			})
		} catch(err) {
			res.status(500).json({
				message: 'Internal Server Error',
				stack: err.stack
			})
		}
	});

	app.post('/update-all', async (req, res) => {
		try {
			const { points, num_users } = req.body;
			const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

			console.log("=====================================================================")
			console.log('Updating (Promise.all)...')
			let startFetch = new Date();
			let users = await Users.find().limit(num_users);
			let endFetch = new Date();
			progress.start(users.length, 0);

			let startLoop = new Date();
			await Promise.all(users.map(user => {
				return new Promise(async (resolve, reject) => {
					await Users.findOneAndUpdate({ _id: user._id }, { $set: { points: points } })
					progress.increment();
					resolve(true)
				});
			}))
			let endLoop = new Date();

			progress.stop();

			// let elapsed = (end - start) / 1000;
			console.log(`Fetch Execution time: ${(endFetch - startFetch) / 1000}s`)
			console.log(`Loop Execution time: ${(endLoop - startLoop) / 1000}s`)
			console.log(`Total Execution time: ${(endLoop - startFetch) / 1000}s`)

			res.json({
				message: 'Success',
				count: users.length
			})
		} catch(err) {
			res.status(500).json({
				message: 'Internal Server Error',
				stack: err.stack
			})
		}
	});
	
	app.post('/update-reduce', async (req, res) => {
		try {
			const { points, num_users } = req.body;
			const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

			console.log("=====================================================================")
			console.log('Updating (Array.reduce)...')
			let start = new Date();
			let users = await Users.find().limit(num_users);
			progress.start(users.length, 0);

      let successCount = 0;
      let failCount = 0;

      await users.reduce(async (el) => {
      	try {
      		const betInsert = await Users.findOneAndUpdate({ _id: el._id }, { $set: { points: points } });
      		successCount += 1;
      		progress.increment();
      	} catch (error) {
      		failCount += 1;
      	}
      }, undefined)

			progress.stop();

			let end = new Date();
			let elapsed = (end - start) / 1000;

      console.log(`Success Update: ${successCount}`);
      console.log(`Failed Update: ${failCount}`);
			console.log(`Total Execution time: ${elapsed}s`)

			res.json({
				message: 'Success',
				count: users.length
			})
		} catch(err) {
			res.status(500).json({
				message: 'Internal Server Error',
				stack: err.stack
			})
		}
	});

}