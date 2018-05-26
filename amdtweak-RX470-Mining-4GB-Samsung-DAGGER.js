//////////////////////////////////////////////////////////////////////////////////////
// BASE /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

const fs = require("fs");
const vbios = require("./lib/vbios.js");

//////////////////////////////////////////////////////////////////////////////////////
// SETTiNGS /////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// GLOBAL

var MCLOCK = 210000;
var CCLOCK = 113300;

var MVDDC = 950;
var CVDDC = 875;

var TTEMP = 58;

// SYS

var CARD_IDS = [1, 2, 3, 4, 5, 6];

const DUMP = true;
const OVERWRITE = true;

// CORELOOP

function updateCard(item, index) {

const CARD_ID = item;
const CARD_PP = `/sys/class/drm/card${CARD_ID}/device/pp_table`;

const buf = fs.readFileSync(CARD_PP);
const obj = vbios.$readObject({ buffer: buf, type: vbios.PowerPlayTable });

if (DUMP)
  console.log(JSON.stringify(obj, null, 2));

//////////////////////////////////////////////////////////////////////////////////////
// MODiFiCATiONS ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// TEMP/FAN

obj.FanTable.TargetTemperature = TTEMP

// CCLOCK

obj.SocClockDependencyTable.Entries[0].SocClock = 30000
obj.SocClockDependencyTable.Entries[1].SocClock = 60000
obj.SocClockDependencyTable.Entries[2].SocClock = 90000
obj.SocClockDependencyTable.Entries[3].SocClock = 95000
obj.SocClockDependencyTable.Entries[4].SocClock = 100000
obj.SocClockDependencyTable.Entries[5].SocClock = 105000
obj.SocClockDependencyTable.Entries[6].SocClock = 110000
obj.SocClockDependencyTable.Entries[7].SocClock = CCLOCK

// CVDCC

obj.VddGfxLookupTable.Entries[0].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[1].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[2].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[3].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[4].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[5].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[6].Vdd = CVDDC
obj.VddGfxLookupTable.Entries[7].Vdd = CVDDC

// MCLOCK

obj.MemClockDependencyTable.Entries[0].MemClock = 30000
obj.MemClockDependencyTable.Entries[1].MemClock = MCLOCK

// MVDCC

obj.VddcLookupTable.Entries[0].Vdd = MVDDC
obj.VddcLookupTable.Entries[1].Vdd = MVDDC
obj.VddcLookupTable.Entries[2].Vdd = MVDDC
obj.VddcLookupTable.Entries[3].Vdd = MVDDC
obj.VddcLookupTable.Entries[4].Vdd = MVDDC
obj.VddcLookupTable.Entries[5].Vdd = MVDDC
obj.VddcLookupTable.Entries[6].Vdd = MVDDC
obj.VddcLookupTable.Entries[7].Vdd = MVDDC
obj.VddcLookupTable.Entries[8].Vdd = MVDDC
obj.VddcLookupTable.Entries[9].Vdd = MVDDC
obj.VddcLookupTable.Entries[10].Vdd = MVDDC
obj.VddcLookupTable.Entries[11].Vdd = MVDDC
obj.VddcLookupTable.Entries[12].Vdd = MVDDC
obj.VddcLookupTable.Entries[13].Vdd = MVDDC
obj.VddcLookupTable.Entries[14].Vdd = MVDDC

// UPDATE

vbios.$updateObject({ buffer: buf, object: obj });

// APPLY

if (OVERWRITE)
  fs.writeFileSync(CARD_PP, buf);

}

//////////////////////////////////////////////////////////////////////////////////////
// E X E C U T E ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

CARD_IDS.forEach(updateCard)

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////// !EOF ///
///////////////////////////////////////////////////////////////////////////////////