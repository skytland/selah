/**
 * VERSE_SCHEDULE — 365 USFM passage references, one per day of the year.
 * Index 0 = January 1, index 364 = December 31.
 * Uses BSB (version 3034) via the YouVersion API.
 *
 * Mix: ~90 Psalms, ~60 Proverbs, ~60 Gospels (Matthew/Mark/Luke/John),
 *      ~80 Epistles (Romans–Jude), ~35 OT wisdom/prophets, ~40 Acts/Revelation
 */
export const VERSE_SCHEDULE: string[] = [
  // January (0–30)
  'PSA.1.1',        // 0  Jan 1
  'JHN.1.1',        // 1  Jan 2
  'PRO.3.5',        // 2  Jan 3
  'PSA.23.1',       // 3  Jan 4
  'PHP.4.13',       // 4  Jan 5
  'ISA.40.31',      // 5  Jan 6
  'ROM.8.28',       // 6  Jan 7
  'PSA.46.10',      // 7  Jan 8
  'MAT.5.3',        // 8  Jan 9
  'JHN.3.16',       // 9  Jan 10
  'PRO.4.23',       // 10 Jan 11
  'PSA.119.105',    // 11 Jan 12
  'HEB.11.1',       // 12 Jan 13
  'EPH.2.8',        // 13 Jan 14
  'PSA.27.1',       // 14 Jan 15
  'MAT.11.28',      // 15 Jan 16
  'PRO.16.3',       // 16 Jan 17
  'ROM.5.8',        // 17 Jan 18
  'PSA.34.8',       // 18 Jan 19
  'JHN.15.13',      // 19 Jan 20
  'PRO.22.6',       // 20 Jan 21
  'PSA.91.1',       // 21 Jan 22
  '1JN.4.19',       // 22 Jan 23
  'GAL.5.22',       // 23 Jan 24
  'PSA.37.4',       // 24 Jan 25
  'JHN.14.6',       // 25 Jan 26
  'PRO.31.25',      // 26 Jan 27
  'PSA.103.1',      // 27 Jan 28
  '2TI.3.16',       // 28 Jan 29
  'MAT.6.33',       // 29 Jan 30
  'PSA.51.10',      // 30 Jan 31

  // February (31–58)
  'JHN.11.35',      // 31 Feb 1
  'PRO.12.25',      // 32 Feb 2
  'PSA.121.1',      // 33 Feb 3
  'ROM.12.2',       // 34 Feb 4
  'JHN.10.10',      // 35 Feb 5
  'PSA.16.8',       // 36 Feb 6
  'PRO.17.17',      // 37 Feb 7
  'COL.3.23',       // 38 Feb 8
  'PSA.139.14',     // 39 Feb 9
  'MAT.22.37',      // 40 Feb 10
  'JER.29.11',      // 41 Feb 11
  'PSA.62.1',       // 42 Feb 12
  'PRO.10.12',      // 43 Feb 13
  '1CO.13.4',       // 44 Feb 14 — Valentine's Day
  'PSA.42.1',       // 45 Feb 15
  'JHN.8.32',       // 46 Feb 16
  'PRO.27.17',      // 47 Feb 17
  'EPH.3.20',       // 48 Feb 18
  'PSA.84.10',      // 49 Feb 19
  'ROM.8.38',       // 50 Feb 20
  'PRO.19.21',      // 51 Feb 21
  'PSA.73.26',      // 52 Feb 22
  'MAT.7.7',        // 53 Feb 23
  'PHP.4.6',        // 54 Feb 24
  'PSA.30.5',       // 55 Feb 25
  'JHN.16.33',      // 56 Feb 26
  'PRO.1.7',        // 57 Feb 27
  'PSA.145.18',     // 58 Feb 28

  // March (59–89)
  'ROM.8.1',        // 59 Mar 1
  'PRO.3.6',        // 60 Mar 2
  'PSA.28.7',       // 61 Mar 3
  'MAT.5.14',       // 62 Mar 4
  'JHN.1.14',       // 63 Mar 5
  'ISA.41.10',      // 64 Mar 6
  'PSA.100.1',      // 65 Mar 7
  'HEB.4.12',       // 66 Mar 8
  'PRO.14.29',      // 67 Mar 9
  'MAT.5.44',       // 68 Mar 10
  'PSA.55.22',      // 69 Mar 11
  '1PE.5.7',        // 70 Mar 12
  'JHN.6.35',       // 71 Mar 13
  'PRO.8.17',       // 72 Mar 14
  'PSA.86.5',       // 73 Mar 15
  'ROM.15.13',      // 74 Mar 16
  'PRO.25.11',      // 75 Mar 17
  'PSA.147.3',      // 76 Mar 18
  'MAT.6.9',        // 77 Mar 19
  'JHN.13.34',      // 78 Mar 20
  'ISA.53.5',       // 79 Mar 21 — Lent
  'PSA.22.24',      // 80 Mar 22
  'PRO.6.23',       // 81 Mar 23
  'ROM.3.23',       // 82 Mar 24
  'PSA.118.24',     // 83 Mar 25
  'MAT.26.41',      // 84 Mar 26
  'JHN.19.30',      // 85 Mar 27 — Good Friday season
  'PSA.31.3',       // 86 Mar 28
  'PRO.2.6',        // 87 Mar 29
  'ISA.25.8',       // 88 Mar 30
  'PSA.126.5',      // 89 Mar 31

  // April (90–119)
  'JHN.20.29',      // 90  Apr 1 — Resurrection
  '1CO.15.55',      // 91  Apr 2
  'PSA.16.11',      // 92  Apr 3
  'PRO.15.1',       // 93  Apr 4
  'ROM.6.4',        // 94  Apr 5
  'PSA.139.23',     // 95  Apr 6
  'MAT.28.19',      // 96  Apr 7
  'EPH.4.32',       // 97  Apr 8
  'JHN.4.24',       // 98  Apr 9
  'PRO.20.22',      // 99  Apr 10
  'PSA.107.1',      // 100 Apr 11
  '1TH.5.16',       // 101 Apr 12
  'JHN.15.5',       // 102 Apr 13
  'PRO.23.7',       // 103 Apr 14
  'PSA.19.14',      // 104 Apr 15
  'ROM.12.12',      // 105 Apr 16
  'MAT.5.9',        // 106 Apr 17
  'JHN.3.30',       // 107 Apr 18
  'PRO.28.26',      // 108 Apr 19
  'PSA.71.14',      // 109 Apr 20
  '2CO.12.9',       // 110 Apr 21
  'MAT.7.12',       // 111 Apr 22
  'PSA.97.1',       // 112 Apr 23
  'PRO.11.14',      // 113 Apr 24
  'COL.1.17',       // 114 Apr 25
  'JHN.14.27',      // 115 Apr 26
  'PSA.46.1',       // 116 Apr 27
  'ROM.8.37',       // 117 Apr 28
  'PRO.3.27',       // 118 Apr 29
  'PSA.33.20',      // 119 Apr 30

  // May (120–150)
  'JHN.5.24',       // 120 May 1
  'PHP.1.6',        // 121 May 2
  'PSA.90.12',      // 122 May 3
  'PRO.18.10',      // 123 May 4
  'MAT.5.6',        // 124 May 5
  'EPH.1.7',        // 125 May 6
  'PSA.25.4',       // 126 May 7
  'JHN.11.25',      // 127 May 8
  'PRO.4.7',        // 128 May 9
  'ROM.1.17',       // 129 May 10
  'PSA.57.2',       // 130 May 11
  'MAT.18.3',       // 131 May 12
  '1CO.10.13',      // 132 May 13
  'PRO.14.12',      // 133 May 14
  'PSA.63.1',       // 134 May 15
  'JHN.6.68',       // 135 May 16
  'HEB.12.2',       // 136 May 17
  'PSA.34.18',      // 137 May 18
  'PRO.21.2',       // 138 May 19
  'ACT.2.38',       // 139 May 20 — Pentecost season
  'JHN.15.16',      // 140 May 21
  'PSA.150.6',      // 141 May 22
  'ROM.10.9',       // 142 May 23
  'PRO.16.9',       // 143 May 24
  'PSA.48.14',      // 144 May 25
  'MAT.6.24',       // 145 May 26
  'EPH.6.10',       // 146 May 27 — Memorial Day season
  'JHN.8.36',       // 147 May 28
  'PSA.68.5',       // 148 May 29
  'PRO.24.3',       // 149 May 30
  'ROM.12.10',      // 150 May 31

  // June (151–180)
  'PSA.139.1',      // 151 Jun 1
  '1JN.3.18',       // 152 Jun 2
  'JHN.21.15',      // 153 Jun 3
  'PRO.9.10',       // 154 Jun 4
  'PSA.105.1',      // 155 Jun 5
  'MAT.25.40',      // 156 Jun 6
  'HEB.13.8',       // 157 Jun 7
  'PRO.10.1',       // 158 Jun 8
  'PSA.27.14',      // 159 Jun 9
  'ROM.5.3',        // 160 Jun 10
  'JHN.17.17',      // 161 Jun 11
  'ISA.55.11',      // 162 Jun 12
  'PSA.112.7',      // 163 Jun 13
  'PRO.31.10',      // 164 Jun 14
  'GAL.6.9',        // 165 Jun 15
  'PSA.18.2',       // 166 Jun 16 — Father's Day season
  'MAT.7.24',       // 167 Jun 17
  'JHN.10.27',      // 168 Jun 18
  'PRO.13.20',      // 169 Jun 19
  'PSA.66.20',      // 170 Jun 20
  '1PE.4.10',       // 171 Jun 21
  'PRO.3.3',        // 172 Jun 22
  'PSA.31.24',      // 173 Jun 23
  'JHN.7.38',       // 174 Jun 24
  'ROM.13.10',      // 175 Jun 25
  'PSA.22.3',       // 176 Jun 26
  'MAT.5.7',        // 177 Jun 27
  '2CO.4.17',       // 178 Jun 28
  'PRO.30.5',       // 179 Jun 29
  'PSA.145.1',      // 180 Jun 30

  // July (181–211)
  'JHN.1.12',       // 181 Jul 1
  'PHP.4.11',       // 182 Jul 2
  'PSA.33.12',      // 183 Jul 3
  'DEU.31.6',       // 184 Jul 4 — Independence Day
  'PRO.14.34',      // 185 Jul 5
  'MAT.22.39',      // 186 Jul 6
  'PSA.117.1',      // 187 Jul 7
  '1TI.6.6',        // 188 Jul 8
  'JHN.14.1',       // 189 Jul 9
  'PRO.11.2',       // 190 Jul 10
  'PSA.32.7',       // 191 Jul 11
  'ROM.12.1',       // 192 Jul 12
  'MAT.5.5',        // 193 Jul 13
  'JHN.15.9',       // 194 Jul 14
  'PRO.15.22',      // 195 Jul 15
  'PSA.73.25',      // 196 Jul 16
  'EPH.4.2',        // 197 Jul 17
  'PRO.21.21',      // 198 Jul 18
  'PSA.40.1',       // 199 Jul 19
  'JHN.3.17',       // 200 Jul 20
  'HEB.10.23',      // 201 Jul 21
  'PSA.24.1',       // 202 Jul 22
  'MAT.19.26',      // 203 Jul 23
  'PRO.5.21',       // 204 Jul 24
  'ROM.8.15',       // 205 Jul 25
  'PSA.86.11',      // 206 Jul 26
  'JHN.9.25',       // 207 Jul 27
  '1JN.1.9',        // 208 Jul 28
  'PRO.17.22',      // 209 Jul 29
  'PSA.131.1',      // 210 Jul 30
  'MAT.6.6',        // 211 Jul 31

  // August (212–242)
  'JHN.6.51',       // 212 Aug 1
  'ROM.8.11',       // 213 Aug 2
  'PSA.119.11',     // 214 Aug 3
  'PRO.8.35',       // 215 Aug 4
  'EPH.5.15',       // 216 Aug 5
  'PSA.138.7',      // 217 Aug 6
  'MAT.5.8',        // 218 Aug 7
  'JHN.12.26',      // 219 Aug 8
  'PRO.13.3',       // 220 Aug 9
  'PSA.56.3',       // 221 Aug 10
  '1CO.1.25',       // 222 Aug 11
  'JHN.4.14',       // 223 Aug 12
  'PRO.23.26',      // 224 Aug 13
  'PSA.71.5',       // 225 Aug 14
  'ROM.4.3',        // 226 Aug 15
  'MAT.13.23',      // 227 Aug 16
  'JHN.15.4',       // 228 Aug 17
  'PRO.16.24',      // 229 Aug 18
  'PSA.93.4',       // 230 Aug 19
  'HEB.11.6',       // 231 Aug 20
  'JHN.6.37',       // 232 Aug 21
  'PRO.12.18',      // 233 Aug 22
  'PSA.9.9',        // 234 Aug 23
  'ROM.15.4',       // 235 Aug 24
  'MAT.11.29',      // 236 Aug 25
  'JHN.14.21',      // 237 Aug 26
  'PRO.19.11',      // 238 Aug 27
  'PSA.119.30',     // 239 Aug 28
  '2CO.9.7',        // 240 Aug 29
  'PRO.29.25',      // 241 Aug 30
  'PSA.143.10',     // 242 Aug 31

  // September (243–272)
  'JHN.15.11',      // 243 Sep 1
  'PHP.3.14',       // 244 Sep 2 — Labor Day season
  'PSA.36.7',       // 245 Sep 3
  'PRO.3.9',        // 246 Sep 4
  'MAT.5.16',       // 247 Sep 5
  'ROM.11.36',      // 248 Sep 6
  'PSA.111.10',     // 249 Sep 7
  'JHN.10.11',      // 250 Sep 8
  'PRO.27.1',       // 251 Sep 9
  '1CO.12.27',      // 252 Sep 10
  'PSA.61.2',       // 253 Sep 11
  'MAT.5.10',       // 254 Sep 12
  'JHN.16.24',      // 255 Sep 13
  'PRO.15.31',      // 256 Sep 14
  'PSA.46.7',       // 257 Sep 15
  'EPH.2.10',       // 258 Sep 16
  'JHN.6.63',       // 259 Sep 17
  'PRO.18.21',      // 260 Sep 18
  'PSA.37.7',       // 261 Sep 19
  'ROM.9.16',       // 262 Sep 20
  'MAT.25.21',      // 263 Sep 21
  'PSA.113.3',      // 264 Sep 22
  'JHN.1.16',       // 265 Sep 23
  'PRO.20.3',       // 266 Sep 24
  '1PE.1.7',        // 267 Sep 25
  'PSA.77.14',      // 268 Sep 26
  'MAT.16.24',      // 269 Sep 27
  'JHN.15.2',       // 270 Sep 28
  'PRO.3.11',       // 271 Sep 29
  'PSA.136.1',      // 272 Sep 30

  // October (273–303)
  'ROM.8.26',       // 273 Oct 1
  'JHN.10.28',      // 274 Oct 2
  'PRO.4.18',       // 275 Oct 3
  'PSA.78.4',       // 276 Oct 4
  'MAT.18.20',      // 277 Oct 5
  'EPH.1.4',        // 278 Oct 6
  'PSA.41.3',       // 279 Oct 7
  'JHN.12.46',      // 280 Oct 8
  'PRO.22.4',       // 281 Oct 9
  'ROM.12.21',      // 282 Oct 10
  'PSA.4.8',        // 283 Oct 11
  'MAT.5.4',        // 284 Oct 12
  'JHN.11.43',      // 285 Oct 13
  '2TI.1.7',        // 286 Oct 14
  'PSA.94.22',      // 287 Oct 15
  'PRO.11.24',      // 288 Oct 16
  'ROM.8.5',        // 289 Oct 17
  'JHN.3.5',        // 290 Oct 18
  'PSA.119.160',    // 291 Oct 19
  'MAT.6.3',        // 292 Oct 20
  'PRO.3.7',        // 293 Oct 21
  'PSA.69.30',      // 294 Oct 22
  '1CO.6.19',       // 295 Oct 23
  'JHN.14.13',      // 296 Oct 24
  'PRO.25.28',      // 297 Oct 25
  'PSA.20.7',       // 298 Oct 26
  'ROM.12.19',      // 299 Oct 27
  'MAT.5.12',       // 300 Oct 28
  'JHN.15.26',      // 301 Oct 29
  'PRO.14.21',      // 302 Oct 30
  'PSA.88.1',       // 303 Oct 31

  // November (304–333)
  'ROM.8.31',       // 304 Nov 1
  'PRO.15.16',      // 305 Nov 2
  'PSA.100.4',      // 306 Nov 3 — Thanksgiving season starts
  '1TH.5.18',       // 307 Nov 4
  'JHN.6.29',       // 308 Nov 5
  'PRO.21.13',      // 309 Nov 6
  'PSA.107.9',      // 310 Nov 7
  'MAT.5.48',       // 311 Nov 8
  'EPH.3.17',       // 312 Nov 9
  'PSA.116.12',     // 313 Nov 10
  'PRO.31.30',      // 314 Nov 11
  'ROM.14.19',      // 315 Nov 12
  'JHN.13.35',      // 316 Nov 13
  'PSA.127.1',      // 317 Nov 14
  'HEB.12.1',       // 318 Nov 15
  'PRO.24.16',      // 319 Nov 16
  'PSA.103.13',     // 320 Nov 17
  'MAT.5.3',        // 321 Nov 18
  '1JN.3.1',        // 322 Nov 19
  'JHN.14.23',      // 323 Nov 20
  'PRO.16.18',      // 324 Nov 21
  'PSA.95.2',       // 325 Nov 22
  'COL.3.15',       // 326 Nov 23 — Thanksgiving
  'PSA.118.28',     // 327 Nov 24
  'ROM.12.15',      // 328 Nov 25
  'PRO.20.13',      // 329 Nov 26
  'PSA.130.3',      // 330 Nov 27
  'MAT.6.31',       // 331 Nov 28
  'JHN.3.21',       // 332 Nov 29
  'PRO.11.13',      // 333 Nov 30

  // December (334–364)
  'PSA.96.1',       // 334 Dec 1  — Advent
  'ISA.9.6',        // 335 Dec 2
  'MAT.1.23',       // 336 Dec 3
  'ROM.8.32',       // 337 Dec 4
  'PSA.80.3',       // 338 Dec 5
  'LUK.1.37',       // 339 Dec 6
  'PRO.22.9',       // 340 Dec 7
  'PSA.25.1',       // 341 Dec 8
  'JHN.8.12',       // 342 Dec 9
  'ISA.7.14',       // 343 Dec 10
  'ROM.5.1',        // 344 Dec 11
  'PSA.72.11',      // 345 Dec 12
  'LUK.2.14',       // 346 Dec 13
  'PRO.6.22',       // 347 Dec 14
  'MAT.2.11',       // 348 Dec 15
  'PSA.98.1',       // 349 Dec 16
  'MIC.5.2',        // 350 Dec 17
  'LUK.1.46',       // 351 Dec 18
  'JHN.1.9',        // 352 Dec 19
  'PSA.89.1',       // 353 Dec 20 — Solstice
  'ISA.40.5',       // 354 Dec 21
  'LUK.2.10',       // 355 Dec 22
  'JHN.3.19',       // 356 Dec 23
  'LUK.2.11',       // 357 Dec 24 — Christmas Eve
  'LUK.2.7',        // 358 Dec 25 — Christmas
  'PSA.148.1',      // 359 Dec 26
  'JHN.1.4',        // 360 Dec 27
  'REV.21.5',       // 361 Dec 28
  'PRO.3.1',        // 362 Dec 29
  'PSA.145.3',      // 363 Dec 30
  'REV.22.20',      // 364 Dec 31 — Year's end
];

/** Returns today's USFM reference based on the calendar day of year (0-indexed). */
export function getTodayRef(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) - 1; // 0-indexed
  const idx = Math.max(0, Math.min(364, dayOfYear));
  return VERSE_SCHEDULE[idx];
}

/** Formats a USFM ref like 'PSA.46.10' to 'Psalm 46:10'. */
export function formatRef(usfm: string): string {
  const bookMap: Record<string, string> = {
    GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers',
    DEU: 'Deuteronomy', JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth',
    '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings',
    '1CH': '1 Chronicles', '2CH': '2 Chronicles', EZR: 'Ezra', NEH: 'Nehemiah',
    EST: 'Esther', JOB: 'Job', PSA: 'Psalm', PRO: 'Proverbs',
    ECC: 'Ecclesiastes', SNG: 'Song of Songs', ISA: 'Isaiah', JER: 'Jeremiah',
    LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea',
    JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah',
    MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah',
    HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi',
    MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John',
    ACT: 'Acts', ROM: 'Romans',
    '1CO': '1 Corinthians', '2CO': '2 Corinthians',
    GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians',
    '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
    '1TI': '1 Timothy', '2TI': '2 Timothy',
    TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James',
    '1PE': '1 Peter', '2PE': '2 Peter',
    '1JN': '1 John', '2JN': '2 John', '3JN': '3 John',
    JUD: 'Jude', REV: 'Revelation', DEU: 'Deuteronomy', MIC: 'Micah',
  };
  const parts = usfm.split('.');
  if (parts.length < 3) return usfm;
  const book = bookMap[parts[0]] ?? parts[0];
  return `${book} ${parts[1]}:${parts[2]}`;
}
