import {
  fetchSumOfTransaction,
  fetchCounts,
  fetchTopAgentYesterday,
} from "../services/metrics.service.js";

export async function sumOfTransaction(req, res) {
  try {
    const metrics = await fetchSumOfTransaction();
    res.json({ metrics });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function metricCounts(req, res) {
  try {
    const counts = await fetchCounts();
    res.json({ counts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function topAgentYesterday(req, res) {
  try {
    const topAgent = await fetchTopAgentYesterday();
    res.json({ topAgent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
