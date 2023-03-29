// Dependencies
import scheduler, { scheduledJobs } from "../scheduler";

describe("scheduler", () => {
	afterEach(() => {
		Object.values(scheduledJobs).forEach(job => job.cancel());
	});

	it("should export schedule module and scheduled object", () => {
		expect(scheduler).toBeDefined();
		expect(scheduledJobs).toBeDefined();
	});

	it("should have an empty scheduleJobs object", () => {
		expect(Object.keys(scheduledJobs).length).toBe(0);
	});

	it("should be able to schedule a job", () => {
		const newJob = scheduler.scheduleJob("JOB_A", "* * * * *", () => {
			console.log("Scheduled job ran!");
		});

		expect(newJob).toBeDefined();
		expect(scheduledJobs[newJob.name]).toBeDefined();
	});

	it("should be able to cancel a job", () => {
		const newJob = scheduler.scheduleJob("JOB_A", "* * * * *", () => {
			console.log("Scheduled job ran!");
		});

		newJob.cancel();
		expect(scheduledJobs[newJob.name]).toBeUndefined();
	});
});
