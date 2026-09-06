import { useState } from 'react';
import { Input } from '@chadcn/upstream-shadcn/input';
import { Cropper } from '@chadcn/upstream-kibo/image-crop';
import { VideoPlayer, VideoPlayerContent, VideoPlayerControlBar, VideoPlayerMuteButton, VideoPlayerPlayButton, VideoPlayerTimeDisplay, VideoPlayerTimeRange } from '@chadcn/upstream-kibo/video-player';
import { SandboxCodeEditor, SandboxLayout, SandboxPreview, SandboxProvider } from '@chadcn/upstream-kibo/sandbox';

export function KiboImageCropDemo() {
  const [file, setFile] = useState<File>();
  return <div className="demo-form"><Input aria-label="Choose image to crop" type="file" accept="image/*" onChange={event => setFile(event.target.files?.[0])} />{file ? <Cropper file={file} className="max-h-48" /> : <p>Select a local image to crop.</p>}</div>;
}

export function KiboVideoPlayerDemo() {
  return <VideoPlayer className="w-full" style={{ aspectRatio: '16 / 9' }}><VideoPlayerContent controls src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" /><VideoPlayerControlBar><VideoPlayerPlayButton /><VideoPlayerTimeDisplay /><VideoPlayerTimeRange /><VideoPlayerMuteButton /></VideoPlayerControlBar></VideoPlayer>;
}

export function KiboSandboxDemo() {
  return <SandboxProvider template="vanilla" files={{ '/index.html': { code: '<main><h1>Kibo Sandbox</h1><p>Edit the file to see the preview.</p></main>' } }}><SandboxLayout><SandboxCodeEditor showTabs /><SandboxPreview /></SandboxLayout></SandboxProvider>;
}
