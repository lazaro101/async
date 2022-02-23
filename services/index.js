const Bets = require(__basedir + '/db/schema/bets')
const BetsLogs = require(__basedir + '/db/schema/bets_logs')

const deleteBets = async (fight_id) => {

	console.log(`Fetch bets by fight_id => ${fight_id}...`)
	let bets_by_fight = await Bets.find({ fight_id: fight_id }).limit(count);
	console.log(`Copy bets to bets logs...`)
	let inserted_bets_logs = await BetsLogs.deleteMany(bets_by_fight)


}


module.exports = {
	transferBetsLOgs
}