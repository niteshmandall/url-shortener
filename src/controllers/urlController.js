const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const { redisClient } = require('../config/redis');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');

exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user.id;

    let alias = customAlias || nanoid(8);

    // Check if custom alias is already taken
    if (customAlias) {
      const existingUrl = await Url.findOne({ alias: customAlias });
      if (existingUrl) {
        return res.status(400).json({ error: 'Custom alias already in use' });
      }
    }

    const url = new Url({
      longUrl,
      shortUrl: `${process.env.BASE_URL}/${alias}`,
      alias,
      topic,
      userId,
    });

    await url.save();
    await redisClient.set(`url:${alias}`, longUrl);

    res.status(201).json({
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    
    // Try cache first
    let longUrl = await redisClient.get(`url:${alias}`);
    
    if (!longUrl) {
      const url = await Url.findOne({ alias });
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
      longUrl = url.longUrl;
      await redisClient.set(`url:${alias}`, longUrl);
    }

    // Track analytics
    const userAgent = new UAParser(req.headers['user-agent']);
    const ip = req.ip;
    const geo = geoip.lookup(ip);

    const clickData = {
      timestamp: new Date(),
      ip,
      userAgent: req.headers['user-agent'],
      os: userAgent.getOS().name,
      device: userAgent.getDevice().type || 'desktop',
      location: geo ? {
        country: geo.country,
        city: geo.city,
      } : null,
    };

    await Url.findOneAndUpdate(
      { alias },
      { $push: { clicks: clickData } }
    );

    res.redirect(longUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};