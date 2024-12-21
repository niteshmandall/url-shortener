const Url = require('../models/Url');

exports.getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await Url.findOne({ alias });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const analytics = {
      totalClicks: url.clicks.length,
      uniqueClicks: new Set(url.clicks.map(click => click.ip)).size,
      clicksByDate: getClicksByDate(url.clicks),
      osType: getOSStats(url.clicks),
      deviceType: getDeviceStats(url.clicks),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;
    const urls = await Url.find({ topic, userId: req.user.id });

    const analytics = {
      totalClicks: urls.reduce((sum, url) => sum + url.clicks.length, 0),
      uniqueClicks: new Set(urls.flatMap(url => 
        url.clicks.map(click => click.ip)
      )).size,
      clicksByDate: getClicksByDate(urls.flatMap(url => url.clicks)),
      urls: urls.map(url => ({
        shortUrl: url.shortUrl,
        totalClicks: url.clicks.length,
        uniqueClicks: new Set(url.clicks.map(click => click.ip)).size,
      })),
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

function getClicksByDate(clicks) {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const clicksByDate = {};
  clicks
    .filter(click => click.timestamp >= last7Days)
    .forEach(click => {
      const date = click.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

  return Object.entries(clicksByDate).map(([date, count]) => ({
    date,
    count,
  }));
}

function getOSStats(clicks) {
  const stats = {};
  clicks.forEach(click => {
    const os = click.os || 'Unknown';
    if (!stats[os]) {
      stats[os] = {
        osName: os,
        uniqueClicks: new Set(),
        uniqueUsers: new Set(),
      };
    }
    stats[os].uniqueClicks.add(click.ip);
    stats[os].uniqueUsers.add(click.userAgent);
  });

  return Object.values(stats).map(stat => ({
    osName: stat.osName,
    uniqueClicks: stat.uniqueClicks.size,
    uniqueUsers: stat.uniqueUsers.size,
  }));
}

function getDeviceStats(clicks) {
  const stats = {};
  clicks.forEach(click => {
    const device = click.device || 'Unknown';
    if (!stats[device]) {
      stats[device] = {
        deviceName: device,
        uniqueClicks: new Set(),
        uniqueUsers: new Set(),
      };
    }
    stats[device].uniqueClicks.add(click.ip);
    stats[device].uniqueUsers.add(click.userAgent);
  });

  return Object.values(stats).map(stat => ({
    deviceName: stat.deviceName,
    uniqueClicks: stat.uniqueClicks.size,
    uniqueUsers: stat.uniqueUsers.size,
  }));
}