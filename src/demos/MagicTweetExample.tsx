import { ClientTweetCard } from '@chadcn/upstream-magicui/client-tweet-card';

export function MagicTweetFixtureDemo() {
  return <div><p className="eyebrow">Illustrative local fixture</p><ClientTweetCard id="fixture-001" apiUrl="/demo-data/tweet.json" /></div>;
}

export function MagicTweetNetworkDemo() {
  return <div><p className="eyebrow">Optional upstream network example</p><ClientTweetCard id="1668408059125702661" /></div>;
}
