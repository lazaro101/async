const cliProgress = require('cli-progress');
const router = require('express').Router();

const TestBets = require(__basedir + '/db/schema/test_bets')
const Bets = require(__basedir + '/db/schema/bets')
const BetsLogs = require(__basedir + '/db/schema/bets_logs')
// const BetsBackup = require(__basedir + '/db/schema/bets_backup')
const Users = require(__basedir + '/db/schema/users')
const UserPointsHistory = require(__basedir + '/db/schema/user_points_history')
const Fights = require(__basedir + '/db/schema/fights')
// const RedisClient = require(__basedir + '/redis')

// const redis = require('redis');
// const RedisClient = redis.createClient();

router.post('/raw-test', async(req, res) => {
	try {
		const { count } = req.body;
		const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

		console.log("=====================================================================")
		console.log('Inserting...')

		let start = new Date();
		progress.start(count, 0);

		let startInsertLoop = new Date();
		for(let i = 0; i < count; i++){
			let doc = getInsertDoc();
			let insertBet = new TestBets(doc);
			await insertBet.save();
			progress.increment();
		}
		let endInsertLoop = new Date();
		progress.stop();

		console.log('Fetching...')
		let startFetch = new Date();
		let bets = await TestBets.find({});
		let endFetch = new Date();

		console.log('Updating...')
		let startUpdateLoop = new Date();
		progress.start(bets.length, 0);
		await Promise.all(bets.map(bet => {
			return new Promise(async (resolve, reject) => {
				await TestBets.findOneAndUpdate({ _id: bet._id }, { $set: { status: (Math.floor(Math.random() * (2-1+1))) ? "win" : "lose" } })
				progress.increment();
				resolve(true)
			});
		}))
		let endUpdateLoop = new Date();
		progress.stop();



		console.log('Deleting...')
		let startDelete = new Date();
		progress.start(bets.length, 0);
		await Promise.all(bets.map(bet => {
			return new Promise(async (resolve, reject) => {
				await TestBets.findOneAndDelete({ _id: bet._id });
				progress.increment();
				resolve(true)
			});
		}))
		let endDelete = new Date();
		progress.stop();

		let end = new Date();

		let insert_time = (endInsertLoop - startInsertLoop) / 1000;
		let fetch_time = (endFetch - startFetch) / 1000;
		let update_time = (endUpdateLoop - startUpdateLoop) / 1000;
		let delete_time = (endDelete - startDelete) / 1000;
		let total_time = (end - start) / 1000;
		console.log(`Insert Execution time: ${insert_time}s`)
		console.log(`Fetch Execution time: ${fetch_time}s`)
		console.log(`Update Execution time: ${update_time}s`)
		console.log(`Delete Execution time: ${delete_time}s`)
		console.log(`Total Execution time: ${total_time}s`)
		console.log(`Start time: ${start} - End time: ${end}`);

		res.json({
			message: 'Success',
			insert_time,
			fetch_time,
			update_time,
			delete_time,
			total_time
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})

router.post('/bulk-test', async(req, res) => {
	try {
		const { count } = req.body;

		if(!count) {
			throw "Invalid Count"
		}

		const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

		console.log("=====================================================================")
		console.log('Inserting...')

		let start = new Date();

		let startInsertLoop = new Date();
		await TestBets.insertMany(new Array(count).fill(getInsertDoc()));
		let endInsertLoop = new Date();

		console.log('Fetching...')
		let startFetch = new Date();
		let bets = await TestBets.find({});
		let endFetch = new Date();

		console.log('Updating...')
		let startUpdateLoop = new Date();
		await TestBets.updateMany({}, { $set: { status: (Math.floor(Math.random() * (2-1+1))) ? "win" : "lose" } });
		let endUpdateLoop = new Date();

		console.log('Deleting...')
		let startDelete = new Date();
		await TestBets.deleteMany({});
		let endDelete = new Date();

		let end = new Date();

		let insert_time = (endInsertLoop - startInsertLoop) / 1000;
		let fetch_time = (endFetch - startFetch) / 1000;
		let update_time = (endUpdateLoop - startUpdateLoop) / 1000;
		let delete_time = (endDelete - startDelete) / 1000;
		let total_time = (end - start) / 1000;
		console.log(`Insert Execution time: ${insert_time}s`)
		console.log(`Fetch Execution time: ${fetch_time}s`)
		console.log(`Update Execution time: ${update_time}s`)
		console.log(`Delete Execution time: ${delete_time}s`)
		console.log(`Total Execution time: ${total_time}s`)
		console.log(`Start time: ${start} - End time: ${end}`);

		res.json({
			message: 'Success',
			insert_time,
			fetch_time,
			update_time,
			delete_time,
			total_time
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})

router.post('/raw-test-users', async(req, res) => {
	try {
		const { count } = req.body;

		if(!count) {
			throw "Invalid Count"
		}

		const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

		console.log("=====================================================================")
		// console.log('Inserting...')

		let start = new Date();

		// let startInsertLoop = new Date();
		// await TestBets.insertMany(new Array(count).fill(getInsertDoc()));
		// let endInsertLoop = new Date();

		console.log('Fetching...')
		let startFetch = new Date();
		let users = await Users.find({roles: "61023a84482fe1033e33cadc"}).limit(count).sort({_id: -1});
		let endFetch = new Date();

		console.log('Updating...')
		let startUpdateLoop = new Date();
		progress.start(users.length, 0);
		await Promise.all(users.map(user => {
			return new Promise(async (resolve, reject) => {
				await Users.findOneAndUpdate({ _id: user._id }, { $inc: { current_points: 1 } })
				progress.increment();
				resolve(true)
			});
		}))
		let endUpdateLoop = new Date();
		progress.stop();

		// console.log('Deleting...')
		// let startDelete = new Date();
		// await TestBets.deleteMany({});
		// let endDelete = new Date();

		let end = new Date();

		// let insert_time = (endInsertLoop - startInsertLoop) / 1000;
		let fetch_time = (endFetch - startFetch) / 1000;
		let update_time = (endUpdateLoop - startUpdateLoop) / 1000;
		// let delete_time = (endDelete - startDelete) / 1000;
		let total_time = (end - start) / 1000;
		// console.log(`Insert Execution time: ${insert_time}s`)
		console.log(`Fetch Execution time: ${fetch_time}s`)
		console.log(`Update Execution time: ${update_time}s`)
		// console.log(`Delete Execution time: ${delete_time}s`)
		console.log(`Total Execution time: ${total_time}s`)
		console.log(`Start time: ${start} - End time: ${end}`);

		res.json({
			message: 'Success',
			// insert_time,
			fetch_time,
			update_time,
			// delete_time,
			total_time,
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})

router.post('/raw-test-bets', async(req, res) => {
	try {
		const { winner } = req.body;

		let updated_users = [];
		let user_points_history = [];
		let winner_side = winner;
		let fight_id = "620cbc1fe4a64c175c0eba43";

		// if(!count) {
		// 	throw "Invalid Count"
		// }

		console.log("=====================================================================")

		let start = new Date();

		console.log('Fetch fight record...')
		let startFetchFight = new Date();
		let fight = await Fights.findOne({ _id: fight_id });
		if(!fight) {
			throw "Fight ID not found"
		}
		let endFetchFight = new Date();
		
		let equalpoints = winner_side == "meron" ? fight.meron_equalpoint : winner_side == "wala" ? fight.wala_equalpoint : 8;

		console.log(`Fetch Bets winner => ${winner_side}...`)
		let startFetchBets = new Date();
		let bets = await Bets.find({ fight_id: fight_id });
		let endFetchBets = new Date();

		console.log(`Update user points...`)
		let startUpdatePoints = new Date();
		for(let bet of bets) {
			if(bet.side === winner_side) {
				let winner_points = bet.amount * equalpoints;
				let user_doc = await Users.findOneAndUpdate({ _id: bet.user_id }, { $inc: { current_points: winner_points } });
				updated_users.push(user_doc._id);
				user_points_history.push(createUserPointsHistory({
					user_id: user_doc._id,
					from: user_doc.current_points,
					to: user_doc.current_points + winner_points,
					amount: winner_points,
					fight_id: fight_id,
					bettingDetails: {
						side: winner_side,
						status: "win"
					}
				}))
			}
		}
		let endUpdatePoints = new Date();

		// console.log(`Fetch bets by fight_id => ${fight_id}...`)
		// let startFetchBets = new Date();
		// let bets_by_fight = await Bets.find({ fight_id: fight_id });
		// // let bets_by_fight = await Bets.find({});
		// let endFetchBets = new Date();

		let startInsertBetsLogs = new Date();
		console.log(`Copy bets to bets logs...`)
		let inserted_bets_logs = await BetsLogs.insertMany(bets)
		let endInsertBetsLogs = new Date();

		let [
			delete_bets_time, 
			insert_point_history_time
		] = await Promise.all([deleteBets(fight_id), insertUserPointsHistory(user_points_history)])

		let end = new Date();

		// let fetch_time = (endFetch - startFetch) / 1000;
		let fetch_fight_time = (endFetchFight - startFetchFight) / 1000;
		let fetch_bets_time = (endFetchBets - startFetchBets) / 1000;
		let insert_bets_logs_time = (endInsertBetsLogs - startInsertBetsLogs) / 1000;
		let update_user_points_time = (endUpdatePoints - startUpdatePoints) / 1000;
		let total_time = (end - start) / 1000;

		res.json({
			message: 'Success',
			updated_users: updated_users.length,
			fetch_fight_time,
			fetch_bets_time,
			insert_bets_logs_time,
			update_user_points_time,
			delete_bets_time,
			insert_point_history_time,
			total_time
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})

router.post('/raw-test-bets-update', async(req, res) => {
	try {
		const { winner } = req.body;

		let updated_users = [];
		let user_points_history = [];
		let winner_side = winner == "meron" ? "meron" : "wala";
		let fight_id = "620cbc1fe4a64c175c0eba43";

		// if(!count) {
		// 	throw "Invalid Count"
		// }

		console.log("=====================================================================")

		let start = new Date();

		console.log('Fetch fight record...')
		let startFetchFight = new Date();
		let fight = await Fights.findOne({ _id: fight_id });
		if(!fight) {
			throw "Fight ID not found"
		}
		let endFetchFight = new Date();

		let equalpoints = winner_side == "meron" ? fight.meron_equalpoint : fight.wala_equalpoint;

		console.log(`Fetch Bets winner => ${winner_side}...`)
		let startFetchBets = new Date();
		let bets = await Bets.find({ fight_id: fight_id })
		let endFetchBets = new Date();

		console.log(`Fetch users...`)
		let startFetchUsers = new Date();
		await (new Promise((resolve, reject) => {
			Users.find({ _id: { $in: bets.map(b => b.user_id) } }, async (err, users) => {
				console.log(users.length)
				for(let bet of bets) {
					if(bet.side === winner_side) {
						let user_doc = users.find(u => u._id.toString() == bet.user_id);

						let winner_points = bet.amount * equalpoints;
						// let user_doc = await Users.findOneAndUpdate({ _id: bet.user_id }, { $inc: { current_points: winner_points } });
						// updated_users.push(user_doc._id);
						user_points_history.push(createUserPointsHistory({
							user_id: user_doc._id,
							from: user_doc.current_points,
							to: user_doc.current_points + winner_points,
							amount: winner_points,
							fight_id: fight_id,
							bettingDetails: {
								side: winner_side,
								status: "win"
							}
						}));
						user_doc.current_points += winner_points;
						await user_doc.save();
					}
				}
				resolve(true)
			})
		}))
		// let users_docs = await Users.find({ _id: { $in: bets.map(b => b.user_id) } });
		let endFetchUsers = new Date();

		console.log(`Update user points...`)
		let startUpdatePoints = new Date();
		// for(let bet of bets) {
		// 	if(bet.side === winner_side) {
		// 		let user_doc = users_docs.find(u => u._id.toString() == bet.user_id);

		// 		let winner_points = bet.amount * equalpoints;
		// 		// let user_doc = await Users.findOneAndUpdate({ _id: bet.user_id }, { $inc: { current_points: winner_points } });
		// 		// updated_users.push(user_doc._id);
		// 		user_points_history.push(createUserPointsHistory({
		// 			user_id: user_doc._id,
		// 			from: user_doc.current_points,
		// 			to: user_doc.current_points + winner_points,
		// 			amount: winner_points,
		// 			fight_id: fight_id,
		// 			bettingDetails: {
		// 				side: winner_side,
		// 				status: "win"
		// 			}
		// 		}));
		// 		user_doc.current_points += winner_points;
		// 		await user_doc.save();
		// 	}
		// }
		let endUpdatePoints = new Date();

		let end = new Date();

		let fetch_fight_time = (endFetchFight - startFetchFight) / 1000;
		let fetch_bets_time = (endFetchBets - startFetchBets) / 1000;
		let fetch_users_time = (endFetchUsers - startFetchUsers) / 1000;
		let update_user_points_time = (endUpdatePoints - startUpdatePoints) / 1000;
		let total_time = (end - start) / 1000;

		res.json({
			message: 'Success',
			updated_users: user_points_history.length,
			fetch_fight_time,
			fetch_bets_time,
			fetch_users_time,
			update_user_points_time,
			total_time
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})


router.post('/test', async(req, res) => {
	try {

		let start = new Date();

		console.log(`Delete bets ...`)
		await Bets.deleteMany({ fight_id: "620cbc1fe4a64c175c0eba43" })

		let end = new Date();

		let total_time = (end - start) / 1000;
		res.json({
			message: 'Success',
			total_time
		})
	} catch(err) {
		console.log(err);
		res.status(500).json({
			error: err.stack || err,
			message: "Internal Server Error"
		})		
	}
})

// router.post('/reset-collections', async(req, res) => {
// 	try {
// 		let fight_id = "620cbc1fe4a64c175c0eba43";

// 		// await Bets.deleteMany({ fight_id: fight_id })
// 		// await BetsLogs.deleteMany({ fight_id: fight_id })
// 		// await UserPointsHistory.deleteMany({ fight_id: fight_id })

// 		let docs = await BetsBackup.find({});
// 		let docs1 = await Bets.find({});
// 		console.log(docs.length, docs1.length)
// 		// await Bets.insertMany(docs);

// 		res.json({
// 			message: 'Success'
// 		})
// 	} catch(err) {
// 		console.log(err);
// 		res.status(500).json({
// 			error: err.stack || err,
// 			message: "Internal Server Error"
// 		})		
// 	}
// })


// router.post('/bulk-test-redis', async(req, res) => {
// 	try {

// 		const { count } = req.body;
// 		// const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

// 		let test = await RedisClient.set("bets", {status: "pending"});
// 		console.log(test)
		
// 		RedisClient.get('bets', function(err, reply) {
// 		  console.log("reply", reply); // ReactJS
// 		});

// 		// console.log(`Insert Execution time: ${(endInsertLoop - startInsertLoop) / 1000}s`)
// 		// console.log(`Fetch Execution time: ${(endFetch - startFetch) / 1000}s`)
// 		// console.log(`Update Execution time: ${(endUpdateLoop - startUpdateLoop) / 1000}s`)
// 		// console.log(`Delete Execution time: ${(endDelete - startDelete) / 1000}s`)
// 		// console.log(`Total Execution time: ${(end - start) / 1000}s`)
// 		// console.log(`Start time: ${start} - End time: ${end}`);

// 		res.json({
// 			message: 'Success',
// 			count
// 		})
// 	} catch(err) {
// 		console.log(err);
// 		res.status(500).json({
// 			error: err.stack || err,
// 			message: "Internal Server Error"
// 		})		
// 	}
// })

module.exports = router;

function getInsertDoc() {
	return {
	    "site_id" : "614080440e00d40767417502",
	    "user_id" : "61e0d47cdd315c0ac3785b02",
	    "arena_id" : "6200c395672dfe3a7c6eed62",
	    "fight_id" : "6201e31fd483782eb10eb5b2",
	    "side" : (Math.floor(Math.random() * (2- 1+ 1))) ? "meron" : "wala",
	    "amount" : 1500,
	    "status" : "pending",
	    "equal_points" : 0,
	    "payout" : 0,
	    "income" : 0,
	    "plasada" : 5,
	    "agent_id" : "61dfa9f13e686953c27071c2",
	    "agent_percent" : 0.4,
	    "agent_income" : 0,
	    "date_processed" : null,
	}
}

function createUserPointsHistory({user_id, from, to, amount, fight_id, bettingDetails}) {
	return {
	    "user_id" : user_id,
	    "wallet_type" : "current-wallet",
	    "movement" : "post-bet",
	    "from" : from,
	    "to" : to,
	    "amount" : amount,
	    "transaction_reference" : "61dfac0fa177145149045f53",
	    "arena_id" : "61dfabe29242137c51305672",
	    "fight_id" : fight_id,
	    "bettingDetails" : bettingDetails
	}
}


const deleteBets = async (fight_id) => {
	try {
		let start = new Date();

		console.log(`Delete bets by fight_id => ${fight_id}...`)
		await Bets.deleteMany({ fight_id: fight_id })

		let end = new Date();

		return (end - start) / 1000;
	} catch(err) {
		console.log(err)
		return 0;
	}
}


const insertUserPointsHistory = async (docs) => {
	try {
		let start = new Date();

		console.log(`Insert user points history...`)
		await UserPointsHistory.insertMany(docs)

		let end = new Date();

		return (end - start) / 1000;
	} catch(err) {
		console.log(err)
		return 0;
	}
}
