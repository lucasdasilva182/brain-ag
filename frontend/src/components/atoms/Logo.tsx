import logoBrainAg from '../../assets/logo-brain-ag-no-bg.png';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 36 }: LogoProps) {
  return <img src={logoBrainAg} alt="Brain Agriculture" height={size} style={{ width: 'auto' }} />;
}
