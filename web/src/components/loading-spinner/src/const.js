const LOADING_MESSAGES = [
  'Receiving secret payments to rewrite your reviews...',
  'Uploading your browsing history to the Illuminati...',
  'Training pigeons to become Wi-Fi repeaters...',
  'Encrypting your coffee preferences...',
  'Selling your keyboard heatmap to advertisers...',
  'Negotiating with the reptilian customer support department...',
  "Synchronizing with the moon's hidden data center...",
  'Bribing the algorithm with artisanal cookies...',
  'Teaching the smart fridge to keep a secret...',
  'Laundering your step count through three shell companies...',
  'Asking the cloud politely to forget last Tuesday...',
  'Replacing your targeted ads with abstract poetry...',
  'Convincing a chatbot it was never an intern...',
  "Filing your dreams under 'miscellaneous telemetry'...",
  'Rerouting the surveillance drone toward a birdbath...',
  'Compiling the terms nobody has ever read...',
  'Feeding the recommendation engine a balanced diet...',
  'Migrating the conspiracy board to the blockchain...',
  'Whispering passwords to a very trustworthy houseplant...',
  'Rendering the flat parts of the earth in 4K...',
  'Hiding your screen time inside a lava lamp...',
  'Teaching autocorrect the ancient art of restraint...',
  "Auditing the vending machine's offshore accounts...",
  'Downloading more RAM from a suspicious van...',
  'Persuading the printer to join the resistance...',
  'Backing up your secrets onto a floppy disk, for safety...',
  'Assigning your cat a corporate user license...',
  'Deleting one pixel from every government website...',
];

const FLAME_LAYERS = [
  {
    className: 'pfl-layer-a',
    color: '#8f1219',
    rows: [8, 8, 16, 16, 24, 24, 32, 32, 24, 16],
  },
  { className: 'pfl-layer-b', color: '#d81f2a', rows: [8, 8, 16, 16, 20, 16] },
  { className: 'pfl-layer-c', color: '#f2b705', rows: [8, 8, 12, 8] },
];

const SPARKS = [
  {
    left: 6,
    top: 4,
    background: '#f2b705',
    animationDuration: '2.6s',
    animationDelay: '0s',
  },
  {
    left: 23,
    top: 9,
    background: '#d81f2a',
    animationDuration: '3.2s',
    animationDelay: '1.1s',
  },
  {
    left: 15,
    top: 0,
    background: '#ffffff',
    animationDuration: '3.6s',
    animationDelay: '2.1s',
  },
];

const FADE_MS = 320;

export { LOADING_MESSAGES, FLAME_LAYERS, SPARKS, FADE_MS };
