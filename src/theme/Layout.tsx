import React from 'react';
import DefaultLayout from '@theme-original/Layout';
import GradientBackground from '../components/GradientBackground';

export default function Layout(props) {
  return (
    <>
      <GradientBackground />
      <DefaultLayout {...props} />
    </>
  );
}
