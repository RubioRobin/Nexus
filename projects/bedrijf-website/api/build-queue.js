export default async function handler(_req, res) {
  try {
    return res.status(200).json({
      ok: true,
      mode: 'telegram-gated',
      message: 'Queue wordt nu via Telegram GO/NO-GO beheerd (niet via GitHub).'
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
