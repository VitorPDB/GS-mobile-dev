export const light = {
  bg:'#F4F6F8', surface:'#FFFFFF', text:'#162D3D', muted:'#536575', line:'#D8E0E7',
  primary:'#126857', onPrimary:'#FFFFFF', subtle:'#E5F2ED', critical:'#A32633', criticalBg:'#FCEBED',
  high:'#875300', highBg:'#FFF1D6', moderate:'#1B5894', moderateBg:'#E8F1FA', low:'#496274', lowBg:'#ECF1F5',
};
export const dark: typeof light = {
  bg:'#101A23',surface:'#192731',text:'#E5EDF5',muted:'#B4C1CD',line:'#3D4D5A',
  primary:'#8AD7BE',onPrimary:'#082D23',subtle:'#1C3D33',critical:'#FFB0B8',criticalBg:'#50252D',
  high:'#FFD086',highBg:'#45351D',moderate:'#AACFFF',moderateBg:'#233D58',low:'#BCD0DE',lowBg:'#2C3B48',
};
export type Theme = typeof light;
