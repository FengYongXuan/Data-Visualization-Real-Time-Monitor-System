const theme = {
  chalk: {
    backgroundColor: '#161522',
    titleColor: '#ffffff',
    themeSrc: 'qiehuan_dark.png'
  },
  vintage: {
    backgroundColor: '#eeeeee',
    titleColor: '#000000',
    themeSrc: 'qiehuan_light.png'
  }
}

export function getThemeValue (themeName) {
  return theme[themeName]
}
