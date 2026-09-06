import { Button } from '@chadcn/upstream-shadcn/button';
import { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Announcement, AnnouncementTag, AnnouncementTitle } from '@chadcn/upstream-kibo/announcement';
import { Banner, BannerAction, BannerClose, BannerIcon, BannerTitle } from '@chadcn/upstream-kibo/banner';
import { Choicebox, ChoiceboxIndicator, ChoiceboxItem, ChoiceboxItemHeader, ChoiceboxItemSubtitle, ChoiceboxItemTitle } from '@chadcn/upstream-kibo/choicebox';
import { Pill, PillButton, PillIndicator, PillStatus } from '@chadcn/upstream-kibo/pill';
import { Rating, RatingButton } from '@chadcn/upstream-kibo/rating';
import { RelativeTime, RelativeTimeZone, RelativeTimeZoneDate, RelativeTimeZoneDisplay, RelativeTimeZoneLabel } from '@chadcn/upstream-kibo/relative-time';
import { Status, StatusIndicator, StatusLabel } from '@chadcn/upstream-kibo/status';
import { Ticker, TickerPrice, TickerPriceChange, TickerSymbol } from '@chadcn/upstream-kibo/ticker';
import { ThemeSwitcher } from '@chadcn/upstream-kibo/theme-switcher';

export function AnnouncementDemo() {
  return <Announcement themed><AnnouncementTag>New</AnnouncementTag><AnnouncementTitle>Keyboard shortcuts are here <Check size={14} /></AnnouncementTitle></Announcement>;
}

export function BannerDemo() {
  const [visible, setVisible] = useState(true);
  return <div className="demo-form">{visible ? <Banner visible onClose={() => setVisible(false)} inset><BannerIcon icon={Bell} /><BannerTitle>Workspace sync is ready to try.</BannerTitle><BannerAction onClick={() => setVisible(false)}>Got it</BannerAction><BannerClose aria-label="Dismiss banner" /></Banner> : <Button type="button" onClick={() => setVisible(true)}>Show banner again</Button>}</div>;
}

export function ChoiceboxDemo() {
  const [value, setValue] = useState('standard');
  return <div className="demo-form"><Choicebox value={value} onValueChange={setValue}><ChoiceboxItem value="standard" id="kibo-standard"><ChoiceboxItemHeader><ChoiceboxItemTitle>Standard plan</ChoiceboxItemTitle><ChoiceboxItemSubtitle>$12 / month</ChoiceboxItemSubtitle></ChoiceboxItemHeader><ChoiceboxIndicator /></ChoiceboxItem><ChoiceboxItem value="pro" id="kibo-pro"><ChoiceboxItemHeader><ChoiceboxItemTitle>Pro plan</ChoiceboxItemTitle><ChoiceboxItemSubtitle>$24 / month</ChoiceboxItemSubtitle></ChoiceboxItemHeader><ChoiceboxIndicator /></ChoiceboxItem></Choicebox><p aria-live="polite">Selected: {value}</p></div>;
}

export function PillDemo() {
  const [following, setFollowing] = useState(false);
  return <Pill><PillStatus><PillIndicator pulse />Design system</PillStatus><span>{following ? 'Following' : 'Follow'}</span><PillButton aria-label={following ? 'Unfollow design system' : 'Follow design system'} onClick={() => setFollowing(value => !value)}>{following ? <Check size={14} /> : <X size={14} />}</PillButton></Pill>;
}

export function RatingDemo() {
  const [rating, setRating] = useState(3);
  return <div className="demo-form"><Rating value={rating} onValueChange={setRating}>{Array.from({ length: 5 }, (_, index) => <RatingButton key={index} />)}</Rating><p aria-live="polite">{rating} of 5 stars</p></div>;
}

export function RelativeTimeDemo() {
  return <RelativeTime dateFormatOptions={{ dateStyle: 'medium' }} timeFormatOptions={{ hour: '2-digit', minute: '2-digit' }}><RelativeTimeZone zone="Europe/London"><RelativeTimeZoneLabel>London</RelativeTimeZoneLabel><RelativeTimeZoneDate /><RelativeTimeZoneDisplay /></RelativeTimeZone><RelativeTimeZone zone="America/Los_Angeles"><RelativeTimeZoneLabel>LA</RelativeTimeZoneLabel><RelativeTimeZoneDate /><RelativeTimeZoneDisplay /></RelativeTimeZone></RelativeTime>;
}

export function StatusDemo() {
  const [status, setStatus] = useState<'online' | 'offline' | 'maintenance' | 'degraded'>('online');
  const statuses = ['online', 'degraded', 'maintenance', 'offline'] as const;
  return <div className="demo-form"><Status status={status}><StatusIndicator /><StatusLabel /></Status><Button type="button" onClick={() => setStatus(statuses[(statuses.indexOf(status) + 1) % statuses.length])}>Cycle status</Button></div>;
}

export function TickerDemo() {
  const [price, setPrice] = useState(182.64);
  return <Ticker aria-label="Update AAPL quote" onClick={() => setPrice(value => value + 1.25)}><TickerSymbol symbol="AAPL" /><TickerPrice price={price} /><TickerPriceChange change={1.25} isPercent /></Ticker>;
}

export function ThemeSwitcherDemo() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  return <div className="demo-form"><ThemeSwitcher value={theme} onChange={setTheme} /><p aria-live="polite">Theme: {theme}</p></div>;
}
