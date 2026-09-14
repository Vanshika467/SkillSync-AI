const fetchJobs = async (role, location = "India") => {

    if (!role) {
        throw new Error("Job role is required");
    }
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${encodeURIComponent(role)}&where=${encodeURIComponent(location)}`;

    const response = await fetch(url);//request jaa rahi hain 
    if (!response.ok) {//response contants http request not jsopmn format 
        throw new Error("Failed to fetch jobs from Adzuna");
    }
    //"Mujhe role aur location do → main Adzuna ka correct URL banaunga → API ko request bhejunga → request fail hui toh error dunga."
    const data = await response.json();
    const jobs = (data.results || []).map((job) => ({
        externalJobId: job.id,
        title: job.title,
        company: job.company?.display_name || "Not specified",
        description: job.description || "",
        location: job.location?.display_name || "Not specified",
        jobUrl: job.redirect_url,
        source: "Adzuna",
        postedAt: job.created || null,
    }));
    
    return jobs;
};

export { fetchJobs };









// Route
//   ↓
// Job Controller
//   ↓
// jobService.js  ← Adzuna se baat karega
//   ↓
// Adzuna API
//   ↓
// Jobs