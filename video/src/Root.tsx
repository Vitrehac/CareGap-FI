import React from 'react';
import { Composition } from 'remotion';
import { MotionPack } from './MotionPack';
import { FPS, TOTAL_FRAMES } from './timeline';

export const Root: React.FC = () => (
  <Composition id="LiweMotionPack" component={MotionPack} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ preview: false }} />
);
