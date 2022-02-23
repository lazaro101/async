
module.exports = {
	apps: [{
		name: "async",
		script: "./app.js",
		watch: false,
		env: {
			"ENV": "STG"
		},
		out_file: "/home/ec2-user/logs/async-console.log",
		error_file: "/home/ec2-user/logs/async-console.log",
		merge_logs: true,
		node_args: "--max_old_space_size=2048",
		instances: 1,
		exec_mode: "cluster"
	}]
};