// ─── HIGHLIGHT.JS ───
var hljsAvailable = (typeof hljs !== 'undefined');

// ─── FIELD TAG DICTIONARY ───
var fieldDictionary = {
  '20':  { name: 'Transaction Reference', key: 'transactionReference', format: '16x', mandatory: true },
  '21':  { name: 'Related Reference', key: 'relatedReference', format: '16x' },
  '13C': { name: 'Time Indication', key: 'timeIndication', format: '/8c/4!n1!x4!n' },
  '23B': { name: 'Bank Operation Code', key: 'bankOperationCode', format: '4!a', mandatory: true },
  '23E': { name: 'Instruction Code', key: 'instructionCode', format: '4!c[/30x]' },
  '26T': { name: 'Transaction Type Code', key: 'transactionTypeCode', format: '3!a' },
  '32A': { name: 'Value Date / Currency / Amount', key: 'valueDateCurrencyAmount', format: '6!n3!a15d', compound: true },
  '33B': { name: 'Currency / Instructed Amount', key: 'instructedAmount', format: '3!a15d', compound: true },
  '36':  { name: 'Exchange Rate', key: 'exchangeRate', format: '12d' },
  '50A': { name: 'Ordering Customer (BIC)', key: 'orderingCustomer', format: 'BIC', party: true },
  '50K': { name: 'Ordering Customer (Name & Address)', key: 'orderingCustomer', format: '4*35x', party: true },
  '50F': { name: 'Ordering Customer (Party ID)', key: 'orderingCustomer', format: 'party', party: true },
  '52A': { name: 'Ordering Institution', key: 'orderingInstitution', format: 'BIC', party: true },
  '52D': { name: 'Ordering Institution (Name & Address)', key: 'orderingInstitution', format: '4*35x', party: true },
  '53A': { name: 'Sender Correspondent', key: 'senderCorrespondent', format: 'BIC' },
  '53B': { name: 'Sender Correspondent (Location)', key: 'senderCorrespondent', format: '3*35x' },
  '54A': { name: 'Receiver Correspondent', key: 'receiverCorrespondent', format: 'BIC' },
  '56A': { name: 'Intermediary Institution', key: 'intermediaryInstitution', format: 'BIC' },
  '56D': { name: 'Intermediary Institution (Name & Address)', key: 'intermediaryInstitution', format: '4*35x', party: true },
  '57A': { name: 'Account With Institution', key: 'accountWithInstitution', format: 'BIC', party: true },
  '57D': { name: 'Account With Institution (Name & Address)', key: 'accountWithInstitution', format: '4*35x', party: true },
  '58A': { name: 'Beneficiary Institution', key: 'beneficiaryInstitution', format: 'BIC', party: true },
  '58D': { name: 'Beneficiary Institution (Name & Address)', key: 'beneficiaryInstitution', format: '4*35x', party: true },
  '59':  { name: 'Beneficiary Customer', key: 'beneficiary', format: '4*35x', party: true },
  '59A': { name: 'Beneficiary Customer (BIC)', key: 'beneficiary', format: 'BIC', party: true },
  '59F': { name: 'Beneficiary Customer (Party ID)', key: 'beneficiary', format: 'party', party: true },
  '70':  { name: 'Remittance Information', key: 'remittanceInformation', format: '4*35x' },
  '71A': { name: 'Details of Charges', key: 'chargeBearer', format: '3!a' },
  '71F': { name: 'Sender Charges', key: 'senderCharges', format: '3!a15d', compound: true },
  '71G': { name: 'Receiver Charges', key: 'receiverCharges', format: '3!a15d', compound: true },
  '72':  { name: 'Sender to Receiver Information', key: 'senderToReceiverInfo', format: '6*35x' },
  '77B': { name: 'Regulatory Reporting', key: 'regulatoryReporting', format: '3*35x' },
  // MT300 FX Confirmation fields
  '15A': { name: 'New Sequence (General Info)', key: 'sequenceA', format: 'empty', section: true },
  '15B': { name: 'New Sequence (Transaction Details)', key: 'sequenceB', format: 'empty', section: true },
  '15C': { name: 'New Sequence (Optional General Info)', key: 'sequenceC', format: 'empty', section: true },
  '15D': { name: 'New Sequence (Split Settlement)', key: 'sequenceD', format: 'empty', section: true },
  '15E': { name: 'New Sequence (Reporting Info)', key: 'sequenceE', format: 'empty', section: true },
  '22A': { name: 'Type of Operation', key: 'typeOfOperation', format: '4!c' },
  '22C': { name: 'Common Reference', key: 'commonReference', format: '4!a4!n4!a' },
  '82A': { name: 'Party A', key: 'partyA', format: 'BIC' },
  '82D': { name: 'Party A (Name & Address)', key: 'partyA', format: '4*35x', party: true },
  '87A': { name: 'Party B', key: 'partyB', format: 'BIC' },
  '87D': { name: 'Party B (Name & Address)', key: 'partyB', format: '4*35x', party: true },
  '30T': { name: 'Trade Date', key: 'tradeDate', format: '8!n' },
  '30V': { name: 'Value Date', key: 'valueDate', format: '8!n' },
  '32B': { name: 'Currency / Amount Bought', key: 'amountBought', format: '3!a15d', compound: true },
  '32E': { name: 'Currency / Amount', key: 'currencyAmount', format: '3!a15d', compound: true },
  '34B': { name: 'Currency / Amount', key: 'currencyAmount2', format: '3!a15d', compound: true },
  // MT940/MT950 Statement fields
  '25':  { name: 'Account Identification', key: 'accountId', format: '35x' },
  '25P': { name: 'Account Identification (with BIC)', key: 'accountId', format: '35x' },
  '28C': { name: 'Statement Number / Sequence', key: 'statementNumber', format: '5n[/5n]' },
  '60F': { name: 'Opening Balance (First)', key: 'openingBalance', format: '1!a6!n3!a15d', compound: true },
  '60M': { name: 'Opening Balance (Intermediate)', key: 'openingBalance', format: '1!a6!n3!a15d', compound: true },
  '61':  { name: 'Statement Line', key: 'statementLine', format: 'complex' },
  '62F': { name: 'Closing Balance (Final)', key: 'closingBalance', format: '1!a6!n3!a15d', compound: true },
  '62M': { name: 'Closing Balance (Intermediate)', key: 'closingBalance', format: '1!a6!n3!a15d', compound: true },
  '64':  { name: 'Closing Available Balance', key: 'closingAvailableBalance', format: '1!a6!n3!a15d', compound: true },
  '65':  { name: 'Forward Available Balance', key: 'forwardAvailableBalance', format: '1!a6!n3!a15d', compound: true },
  '86':  { name: 'Information to Account Owner', key: 'infoToOwner', format: '6*65x' },
  // MT199 Free Format
  '79':  { name: 'Narrative', key: 'narrative', format: '35*50x' },
};

// ─── MESSAGE TYPE SCHEMAS ───
var schemaRegistry = {
  'MT103': {
    name: 'Single Customer Credit Transfer',
    mandatory: ['20', '23B', '32A', '50A|50K|50F', '59|59A|59F', '71A'],
    optional: ['13C', '21', '23E', '26T', '33B', '36', '52A|52D', '53A|53B', '54A', '56A|56D', '57A|57D', '70', '71F', '71G', '72', '77B'],
  },
  'MT202': {
    name: 'General Financial Institution Transfer',
    mandatory: ['20', '21', '32A', '52A|52D', '58A|58D'],
    optional: ['13C', '53A|53B', '54A', '56A|56D', '57A|57D', '72'],
  },
  'MT300': {
    name: 'FX Confirmation',
    mandatory: ['15A', '20', '22A', '22C', '82A|82D', '87A|87D', '15B', '30T', '30V', '36', '32B', '33B', '57A|57D'],
    optional: ['21', '58A|58D', '15C', '15D', '15E', '72'],
  },
  'MT940': {
    name: 'Customer Statement Message',
    mandatory: ['20', '25', '28C', '60F|60M', '62F|62M'],
    optional: ['21', '25P', '61', '86', '64', '65'],
  },
  'MT950': {
    name: 'Statement Message',
    mandatory: ['20', '25', '28C', '60F|60M', '62F|62M'],
    optional: ['61', '86', '64', '65'],
  },
  'MT199': {
    name: 'Free Format Message',
    mandatory: ['20', '79'],
    optional: ['21'],
  },
};

// ─── SAMPLE MESSAGES ───
var sampleMessages = {
  'mt103': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I103COBADEFFXXXXN}\n{4:\n:20:SHANX-20250101-001\n:23B:CRED\n:32A:250101USD10000,00\n:50K:/GB29NWBK60161331926819\nAcme Corporation\n1 Canada Square\nLondon E14 5AB\n:59:/DE89370400440532013000\nGlobal Trade Bank\nNeue Mainzer Str 32\nFrankfurt 60311\n:70:INVOICE REF 2025-INV-0042\n:71A:SHA\n-}',
  'mt202': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I202COBADEFFXXXXN}\n{4:\n:20:SHANX-COV-20250101\n:21:SHANX-20250101-001\n:32A:250101USD10000,00\n:52A:NWBKGB2L\n:58A:COBADEFF\n-}',
  'mt300': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I300COBADEFFXXXXN}\n{4:\n:15A:\n:20:FX-20250115-007\n:21:RELREF-20250115\n:22A:NEWT\n:22C:NWBK0001COBA\n:82A:NWBKGB2L\n:87A:COBADEFF\n:15B:\n:30T:20250117\n:30V:20250119\n:36:1,0850\n:32B:USD1500000,00\n:57A:COBADEFF\n:33B:EUR1382488,48\n:57A:NWBKGB2L\n:58A:COBADEFF\n-}',
  'mt199': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I199COBADEFFXXXXN}\n{4:\n:20:FREEFORMAT-001\n:21:SHANX-20250101-001\n:79:THIS IS A FREE FORMAT MESSAGE\nREGARDING PAYMENT REF SHANX-20250101-001\nPLEASE CONFIRM RECEIPT OF FUNDS\nREGARDS TREASURY OPS\n-}',
  'mt940': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I940COBADEFFXXXXN}\n{4:\n:20:STMT-20250131\n:25:GB29NWBK60161331926819\n:28C:00001/001\n:60F:C250101GBP50000,00\n:61:2501150115D10000,00NTRFshanx-ref-001//ACME-PAY-001\n:86:PAYMENT TO ACME CORPORATION\n:61:2501200120C25000,00NTRFCLIENT-RECEIPT//RCV-2025-042\n:86:RECEIPT FROM CLIENT SERVICES\n:62F:C250131GBP65000,00\n:64:C250131GBP65000,00\n-}',
  'mt950': '{1:F01NWBKGB2LAXXX0000000000}\n{2:I950COBADEFFXXXXN}\n{4:\n:20:FISTMT-20250131\n:25:GB29NWBK60161331926819\n:28C:00001/001\n:60F:C250101USD100000,00\n:61:2501100110D50000,00NTRFshanx-cov-001//COV-2025-001\n:86:COVER PAYMENT NWBKGB2L TO COBADEFF\n:61:2501150115C75000,00NTRFINCOMING-001//RCV-2025-010\n:86:INCOMING TRANSFER FROM JPMORGAN\n:62F:C250131USD125000,00\n-}',
};

// ─── ENVELOPE PARSER ───
function parseEnvelope(rawText) {
  var result = { header1: null, header2: null, header3: null, textBlock: '', trailer: null, detectedType: null };

  // Block 1: Basic Header {1:...}
  var m1 = rawText.match(/\{1:([^}]+)\}/);
  if (m1) {
    var h = m1[1];
    result.header1 = {
      appId: h.charAt(0),
      serviceId: h.substring(1, 3),
      senderBIC: h.substring(3, 15),
      sessionNumber: h.substring(15, 19),
      sequenceNumber: h.substring(19, 25),
    };
  }

  // Block 2: Application Header {2:...}
  var m2 = rawText.match(/\{2:([^}]+)\}/);
  if (m2) {
    var ah = m2[1];
    var direction = ah.charAt(0); // I = Input, O = Output
    if (direction === 'I') {
      var msgType = ah.substring(1, 4);
      result.header2 = {
        direction: 'Input',
        messageType: msgType,
        receiverBIC: ah.substring(4, 16),
        priority: ah.charAt(16) || 'N',
      };
      result.detectedType = 'MT' + msgType;
    } else if (direction === 'O') {
      var msgType = ah.substring(1, 4);
      result.header2 = {
        direction: 'Output',
        messageType: msgType,
        inputTime: ah.substring(4, 8),
        inputDate: ah.substring(8, 14),
        senderBIC: ah.substring(14, 26),
        outputDate: ah.substring(26, 32),
        outputTime: ah.substring(32, 36),
        priority: ah.charAt(36) || 'N',
      };
      result.detectedType = 'MT' + msgType;
    }
  }

  // Block 3: User Header (optional) {3:...}
  var m3 = rawText.match(/\{3:([^}]+)\}/);
  if (m3) {
    result.header3 = m3[1];
  }

  // Block 4: Text Block {4:\n...\n-}
  var m4 = rawText.match(/\{4:\s*\n([\s\S]*?)\n-\}/);
  if (m4) {
    result.textBlock = m4[1];
  } else {
    // Fallback: try without envelope, assume raw text block
    var stripped = rawText.replace(/\{[12345]:[^}]*\}/g, '').trim();
    if (stripped.indexOf(':') === 0 || stripped.match(/^:\d{2}[A-Z]?:/)) {
      result.textBlock = stripped;
    }
  }

  // Block 5: Trailer (optional) {5:...}
  var m5 = rawText.match(/\{5:([^}]+)\}/);
  if (m5) {
    result.trailer = m5[1];
  }

  return result;
}

// ─── FIELD SPLITTER ───
function splitFields(textBlock) {
  var fields = [];
  var lines = textBlock.split('\n');
  var currentTag = null;
  var currentValue = '';
  var currentLine = 0;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var tagMatch = line.match(/^:(\d{2}[A-Z]?):(.*)/);
    if (tagMatch) {
      if (currentTag !== null) {
        fields.push({ tag: currentTag, value: currentValue.trim(), lineNumber: currentLine });
      }
      currentTag = tagMatch[1];
      currentValue = tagMatch[2];
      currentLine = i + 1;
    } else if (currentTag !== null) {
      currentValue += '\n' + line;
    }
  }

  if (currentTag !== null) {
    fields.push({ tag: currentTag, value: currentValue.trim(), lineNumber: currentLine });
  }

  return fields;
}

// ─── COMPOUND FIELD DECODERS ───
function decode32A(value) {
  // Format: YYMMDD + CCY(3) + Amount (with comma as decimal separator)
  var cleaned = value.replace(/\n/g, '').trim();
  var dateStr = cleaned.substring(0, 6);
  var ccy = cleaned.substring(6, 9);
  var amtStr = cleaned.substring(9).replace(',', '.');

  var yy = parseInt(dateStr.substring(0, 2), 10);
  var mm = dateStr.substring(2, 4);
  var dd = dateStr.substring(4, 6);
  var fullYear = (yy > 79 ? 1900 : 2000) + yy;

  return {
    date: fullYear + '-' + mm + '-' + dd,
    currency: ccy,
    amount: parseFloat(amtStr) || 0,
  };
}

function decode33B(value) {
  var cleaned = value.replace(/\n/g, '').trim();
  var ccy = cleaned.substring(0, 3);
  var amtStr = cleaned.substring(3).replace(',', '.');
  return {
    currency: ccy,
    amount: parseFloat(amtStr) || 0,
  };
}

function decodeParty(value) {
  var lines = value.split('\n');
  var account = null;
  var nameLines = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (i === 0 && line.charAt(0) === '/') {
      account = line.substring(1);
    } else if (line.length > 0) {
      nameLines.push(line);
    }
  }

  var result = {};
  if (account) result.account = account;
  if (nameLines.length > 0) result.name = nameLines[0];
  if (nameLines.length > 1) result.address = nameLines.slice(1);
  return result;
}

function decodePartyF(value) {
  // :50F: format — structured party with coded lines
  var lines = value.split('\n');
  var result = {};
  var addressLines = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (i === 0 && line.charAt(0) === '/') {
      result.account = line.substring(1);
    } else if (line.match(/^1\//)) {
      result.name = line.substring(2);
    } else if (line.match(/^2\//)) {
      addressLines.push(line.substring(2));
    } else if (line.match(/^3\//)) {
      result.countryCity = line.substring(2);
    } else if (line.match(/^4\//)) {
      result.dateOfBirth = line.substring(2);
    }
  }

  if (addressLines.length > 0) result.address = addressLines;
  return result;
}

function decodeCharges(value) {
  var cleaned = value.replace(/\n/g, '').trim();
  var ccy = cleaned.substring(0, 3);
  var amtStr = cleaned.substring(3).replace(',', '.');
  return {
    currency: ccy,
    amount: parseFloat(amtStr) || 0,
  };
}

// ─── MAIN PARSE FUNCTION ───
function parseMT(rawText, forceType) {
  var envelope = parseEnvelope(rawText);
  var detectedType = forceType || envelope.detectedType;
  var schema = detectedType ? schemaRegistry[detectedType] : null;

  var result = {
    messageType: detectedType || 'Unknown',
    messageTypeName: schema ? schema.name : '',
    envelope: {},
    fields: {},
    extracted: {},
    errors: [],
    warnings: [],
  };

  // Envelope info
  if (envelope.header1) {
    result.envelope.senderBIC = envelope.header1.senderBIC;
  }
  if (envelope.header2) {
    result.envelope.direction = envelope.header2.direction;
    result.envelope.receiverBIC = envelope.header2.receiverBIC || '';
    result.envelope.priority = envelope.header2.priority;
  }

  if (!envelope.textBlock) {
    result.errors.push({ tag: null, message: 'No text block (Block 4) found. Ensure message contains {4: ... -} block.' });
    result.valid = false;
    return result;
  }

  var fields = splitFields(envelope.textBlock);

  if (fields.length === 0) {
    result.errors.push({ tag: null, message: 'No field tags found in text block.' });
    result.valid = false;
    return result;
  }

  // Collect all tags found
  var foundTags = {};
  var senderChargesArr = [];

  for (var i = 0; i < fields.length; i++) {
    var f = fields[i];
    var def = fieldDictionary[f.tag];

    if (!def) {
      result.warnings.push({ tag: f.tag, message: 'Unknown field tag :' + f.tag + ':' });
      result.fields[f.tag] = { tag: f.tag, rawValue: f.value, name: 'Unknown' };
      continue;
    }

    foundTags[f.tag] = true;
    var decoded;

    // Decode based on tag
    if (f.tag === '32A') {
      decoded = decode32A(f.value);
      result.extracted.valueDate = decoded.date;
      result.extracted.currency = decoded.currency;
      result.extracted.amount = decoded.amount;
    } else if (f.tag === '33B') {
      decoded = decode33B(f.value);
      result.extracted.instructedCurrency = decoded.currency;
      result.extracted.instructedAmount = decoded.amount;
    } else if (f.tag === '71F') {
      decoded = decodeCharges(f.value);
      senderChargesArr.push(decoded);
      decoded = senderChargesArr;
    } else if (f.tag === '71G') {
      decoded = decodeCharges(f.value);
    } else if (def.party && (def.format === '4*35x' || def.format === 'BIC')) {
      if (def.format === 'BIC') {
        decoded = f.value.trim();
      } else {
        decoded = decodeParty(f.value);
      }
    } else if (def.party && def.format === 'party') {
      decoded = f.tag.endsWith('F') ? decodePartyF(f.value) : decodeParty(f.value);
    } else {
      decoded = f.value.trim();
    }

    result.fields[f.tag] = {
      tag: f.tag,
      name: def.name,
      key: def.key,
      rawValue: f.value,
      decoded: decoded,
      party: def.party || false,
    };

    // Map to extracted using key
    if (def.key === 'valueDateCurrencyAmount') {
      // Already extracted above
    } else if (def.key === 'senderCharges') {
      result.extracted.senderCharges = senderChargesArr;
    } else {
      result.extracted[def.key] = decoded;
    }
  }

  // Validate mandatory fields
  if (schema) {
    for (var m = 0; m < schema.mandatory.length; m++) {
      var mandatoryGroup = schema.mandatory[m];
      var alternatives = mandatoryGroup.split('|');
      var found = false;
      for (var a = 0; a < alternatives.length; a++) {
        if (foundTags[alternatives[a]]) {
          found = true;
          break;
        }
      }
      if (!found) {
        var altNames = alternatives.map(function(t) {
          return ':' + t + ':' + (fieldDictionary[t] ? ' (' + fieldDictionary[t].name + ')' : '');
        }).join(' or ');
        result.errors.push({
          tag: alternatives[0],
          message: 'Missing mandatory field ' + altNames,
        });
      }
    }
  }

  result.valid = result.errors.length === 0;
  result.parsedAt = new Date().toISOString();
  return result;
}

// ─── BUILD JSON OUTPUT ───
function buildJsonOutput(result) {
  var json = {
    messageType: result.messageType,
  };

  // Dynamically include all extracted fields
  var keys = Object.keys(result.extracted);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var v = result.extracted[k];
    if (v !== undefined && v !== null && v !== '') {
      json[k] = v;
    }
  }

  // Add plain English summary (strip HTML tags for JSON)
  var englishParts = buildPlainEnglish(result);
  if (englishParts.length > 0) {
    json.summaryPlain = englishParts.join(' ').replace(/<[^>]*>/g, '');
  }

  json._meta = {
    valid: result.valid,
    errors: result.errors.map(function(e) { return e.message; }),
    warnings: result.warnings.map(function(w) { return w.message; }),
    parsedAt: result.parsedAt,
  };

  return json;
}

// ─── PLAIN ENGLISH SUMMARY ───
function buildPlainEnglish(result) {
  var ext = result.extracted;
  var env = result.envelope;
  var type = result.messageType;
  var parts = [];

  function partyName(p) {
    if (!p) return null;
    if (typeof p === 'string') return p;
    if (p.name) return p.name;
    if (p.account) return 'account ' + p.account;
    return null;
  }

  function partyAccount(p) {
    if (!p) return null;
    if (typeof p === 'string') return null;
    return p.account || null;
  }

  function bicName(bic) {
    return bic || null;
  }

  function fmtAmt(amount, currency) {
    if (amount === undefined || amount === null) return null;
    var num = (typeof amount === 'number') ? amount : parseFloat(String(amount).replace(',', '.'));
    if (isNaN(num)) return currency ? currency + ' ' + amount : String(amount);
    return currency ? formatAmount(num) + ' ' + currency : formatAmount(num);
  }

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(d) {
    if (!d) return null;
    var iso = d;
    // Handle YYYYMMDD format
    if (/^\d{8}$/.test(d)) {
      iso = d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8);
    }
    // Handle YYYY-MM-DD format → "Jan 1, 2025"
    var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) {
      var month = monthNames[parseInt(m[2], 10) - 1] || m[2];
      var day = parseInt(m[3], 10);
      return month + ' ' + day + ', ' + m[1];
    }
    return d;
  }

  if (type === 'MT103') {
    var sender = partyName(ext.orderingCustomer);
    var senderAcct = partyAccount(ext.orderingCustomer);
    var receiver = partyName(ext.beneficiary);
    var receiverAcct = partyAccount(ext.beneficiary);
    var amt = fmtAmt(ext.amount, ext.currency);

    var line1 = '';
    if (sender && amt && receiver) {
      line1 = '<span class="data">' + escHtml(sender) + '</span>';
      if (senderAcct) line1 += ' (' + escHtml(senderAcct) + ')';
      line1 += ' is sending <span class="data">' + escHtml(amt) + '</span> to <span class="data">' + escHtml(receiver) + '</span>';
      if (receiverAcct) line1 += ' (' + escHtml(receiverAcct) + ')';
      line1 += '.';
      parts.push(line1);
    }

    if (env.senderBIC || env.receiverBIC) {
      var route = 'Routed';
      if (env.senderBIC) route += ' from <span class="data">' + escHtml(env.senderBIC) + '</span>';
      if (env.receiverBIC) route += ' to <span class="data">' + escHtml(env.receiverBIC) + '</span>';
      route += '.';
      parts.push(route);
    }

    if (ext.chargeBearer) {
      var cb = ext.chargeBearer;
      if (cb === 'SHA') parts.push('Charges are shared between sender and receiver.');
      else if (cb === 'OUR') parts.push('All charges paid by the sender.');
      else if (cb === 'BEN') parts.push('All charges paid by the beneficiary.');
    }

    if (ext.remittanceInformation) {
      parts.push('Reference: <span class="data">' + escHtml(ext.remittanceInformation) + '</span>.');
    }

    if (ext.valueDate) {
      parts.push('Transaction date is <span class="data">' + escHtml(fmtDate(ext.valueDate)) + '</span>.');
    }

  } else if (type === 'MT202') {
    var ordInst = partyName(ext.orderingInstitution) || bicName(ext.orderingInstitution);
    var benInst = partyName(ext.beneficiaryInstitution) || bicName(ext.beneficiaryInstitution);
    var amt = fmtAmt(ext.amount, ext.currency);

    var line1 = '';
    if (ordInst && amt && benInst) {
      line1 = '<span class="data">' + escHtml(ordInst) + '</span> is transferring <span class="data">' + escHtml(amt) + '</span> to <span class="data">' + escHtml(benInst) + '</span>.';
      parts.push(line1);
    }

    if (ext.transactionReference) {
      parts.push('Transaction reference: <span class="data">' + escHtml(ext.transactionReference) + '</span>.');
    }
    if (ext.relatedReference) {
      parts.push('Related to: <span class="data">' + escHtml(ext.relatedReference) + '</span>.');
    }
    if (ext.valueDate) {
      parts.push('Transaction date is <span class="data">' + escHtml(fmtDate(ext.valueDate)) + '</span>.');
    }

  } else if (type === 'MT300') {
    var partyA = bicName(ext.partyA);
    var partyB = bicName(ext.partyB);

    if (partyA && partyB) {
      var line1 = '<span class="data">' + escHtml(partyA) + '</span> and <span class="data">' + escHtml(partyB) + '</span> are confirming an FX trade';
      if (ext.typeOfOperation) {
        var ops = { 'NEWT': 'new transaction', 'AMND': 'amendment', 'CANC': 'cancellation' };
        line1 += ' (' + (ops[ext.typeOfOperation] || ext.typeOfOperation) + ')';
      }
      line1 += '.';
      parts.push(line1);
    }

    var bought = ext.amountBought;
    if (bought && typeof bought === 'string') {
      var bCcy = bought.substring(0, 3);
      var bAmt = bought.substring(3).replace(',', '.');
      var bNum = parseFloat(bAmt);
      if (!isNaN(bNum)) {
        parts.push('Buying <span class="data">' + escHtml(fmtAmt(bNum, bCcy)) + '</span>.');
      }
    }

    if (ext.instructedAmount && typeof ext.instructedAmount === 'object') {
      parts.push('Selling <span class="data">' + escHtml(fmtAmt(ext.instructedAmount.amount, ext.instructedAmount.currency)) + '</span>.');
    } else if (ext.instructedCurrency && ext.instructedAmount) {
      parts.push('Selling <span class="data">' + escHtml(fmtAmt(ext.instructedAmount, ext.instructedCurrency)) + '</span>.');
    }

    if (ext.exchangeRate) {
      parts.push('Exchange rate: <span class="data">' + escHtml(ext.exchangeRate) + '</span>.');
    }
    if (ext.tradeDate) {
      parts.push('Trade date is <span class="data">' + escHtml(fmtDate(ext.tradeDate)) + '</span>. Transaction date is <span class="data">' + escHtml(fmtDate(ext.valueDate || '')) + '</span>.');
    }

  } else if (type === 'MT940' || type === 'MT950') {
    var label = type === 'MT940' ? 'Customer statement' : 'FI-to-FI statement';
    var line1 = label;
    if (ext.accountId) line1 += ' for account <span class="data">' + escHtml(ext.accountId) + '</span>';
    line1 += '.';
    parts.push(line1);

    if (ext.statementNumber) {
      parts.push('Statement number: <span class="data">' + escHtml(ext.statementNumber) + '</span>.');
    }

    if (ext.openingBalance) {
      var ob = ext.openingBalance;
      if (typeof ob === 'string') {
        parts.push('Opening balance: <span class="data">' + escHtml(ob) + '</span>.');
      }
    }
    if (ext.closingBalance) {
      var cb = ext.closingBalance;
      if (typeof cb === 'string') {
        parts.push('Closing balance: <span class="data">' + escHtml(cb) + '</span>.');
      }
    }

  } else if (type === 'MT199') {
    parts.push('Free format message.');
    if (ext.transactionReference) {
      parts.push('Reference: <span class="data">' + escHtml(ext.transactionReference) + '</span>.');
    }
    if (ext.relatedReference) {
      parts.push('Related to: <span class="data">' + escHtml(ext.relatedReference) + '</span>.');
    }
    if (ext.narrative) {
      parts.push(escHtml(ext.narrative));
    }
  }

  // Fallback if no parts generated
  if (parts.length === 0) {
    parts.push(escHtml(result.messageType) + ' message with ' + Object.keys(result.fields).length + ' fields parsed.');
  }

  return parts;
}

// ─── RESULT RENDERING ───
function renderResults(result) {
  var container = document.getElementById('results-content');
  var actionsWrap = document.getElementById('actions-dropdown-wrap');
  actionsWrap.classList.add('visible');
  container.innerHTML = '';

  // Summary banner — outside results-body-inner so it's flush to the top
  var summary = document.createElement('div');
  var errCount = result.errors.length;
  var warnCount = result.warnings.length;

  if (result.valid) {
    summary.className = 'validation-summary summary-valid';
    var msg = 'Valid <span class="msg-type-badge">' + escHtml(result.messageType) + '</span> message';
    if (result.messageTypeName) msg += ' &mdash; ' + escHtml(result.messageTypeName);
    if (warnCount > 0) msg += ', ' + warnCount + ' warning' + (warnCount !== 1 ? 's' : '');
    summary.innerHTML = '<span uk-icon="icon: check; ratio: 1.1"></span><span>' + msg + '</span>';
  } else {
    summary.className = 'validation-summary summary-invalid';
    var msg = errCount + ' error' + (errCount !== 1 ? 's' : '') + ' found';
    if (result.messageType !== 'Unknown') msg += ' in <span class="msg-type-badge">' + escHtml(result.messageType) + '</span>';
    if (warnCount > 0) msg += ', ' + warnCount + ' warning' + (warnCount !== 1 ? 's' : '');
    summary.innerHTML = '<span uk-icon="icon: close; ratio: 1.1"></span><span>' + msg + '</span>';
  }
  container.appendChild(summary);

  // Inner wrap for all content below the banner
  var inner = document.createElement('div');
  inner.className = 'results-body-inner';

  // Plain English summary
  var englishParts = buildPlainEnglish(result);
  if (englishParts.length > 0) {
    var summarySection = document.createElement('div');
    summarySection.className = 'plain-english';
    summarySection.innerHTML =
      '<div class="plain-english-header">' +
        '<div class="plain-english-icon"><img src="assets/summary.svg" alt=""></div>' +
        '<span class="plain-english-label">Summary</span>' +
      '</div>' +
      '<div class="plain-english-text">' + englishParts.join(' ') + '</div>';
    inner.appendChild(summarySection);
  }

  // Errors
  if (errCount > 0) {
    var section = '<div class="section-header">Errors <span class="section-count">' + errCount + '</span></div>';
    for (var i = 0; i < result.errors.length; i++) {
      var err = result.errors[i];
      section += '<div class="error-item type-error">';
      section += '<span class="ei-icon" uk-icon="icon: close; ratio: 0.7"></span>';
      section += '<div><span>' + escHtml(err.message) + '</span>';
      if (err.tag) section += '<span class="field-path"><span class="tag-badge">:' + escHtml(err.tag) + ':</span></span>';
      section += '</div></div>';
    }
    var errDiv = document.createElement('div');
    errDiv.innerHTML = section;
    inner.appendChild(errDiv);
  }

  // Warnings
  if (warnCount > 0) {
    var section = '<div class="section-header">Warnings <span class="section-count">' + warnCount + '</span></div>';
    for (var i = 0; i < result.warnings.length; i++) {
      var warn = result.warnings[i];
      section += '<div class="error-item type-warning">';
      section += '<span class="ei-icon" uk-icon="icon: warning; ratio: 0.7"></span>';
      section += '<div><span>' + escHtml(warn.message) + '</span>';
      if (warn.tag) section += '<span class="field-path"><span class="tag-badge">:' + escHtml(warn.tag) + ':</span></span>';
      section += '</div></div>';
    }
    var warnDiv = document.createElement('div');
    warnDiv.innerHTML = section;
    inner.appendChild(warnDiv);
  }

  // Parsed Fields
  var fieldKeys = Object.keys(result.fields);
  if (fieldKeys.length > 0) {
    var section = '<div class="section-header">Parsed Fields <span class="section-count">' + fieldKeys.length + '</span></div>';
    section += '<div class="fields-grid">';
    for (var k = 0; k < fieldKeys.length; k++) {
      section += renderField(result.fields[fieldKeys[k]]);
    }
    section += '</div>';
    var fieldsDiv = document.createElement('div');
    fieldsDiv.innerHTML = section;
    inner.appendChild(fieldsDiv);
  }

  // Envelope Info
  if (result.envelope && (result.envelope.senderBIC || result.envelope.receiverBIC)) {
    var section = '<div class="section-header">Envelope</div><div class="envelope-section">';
    if (result.envelope.senderBIC) {
      section += '<div class="envelope-row"><span class="envelope-label">Sender BIC</span><span class="envelope-value">' + escHtml(result.envelope.senderBIC) + '</span></div>';
    }
    if (result.envelope.receiverBIC) {
      section += '<div class="envelope-row"><span class="envelope-label">Receiver BIC</span><span class="envelope-value">' + escHtml(result.envelope.receiverBIC) + '</span></div>';
    }
    if (result.envelope.direction) {
      section += '<div class="envelope-row"><span class="envelope-label">Direction</span><span class="envelope-value">' + escHtml(result.envelope.direction) + '</span></div>';
    }
    if (result.envelope.priority) {
      section += '<div class="envelope-row"><span class="envelope-label">Priority</span><span class="envelope-value">' + escHtml(result.envelope.priority) + '</span></div>';
    }
    section += '</div>';
    var envDiv = document.createElement('div');
    envDiv.innerHTML = section;
    inner.appendChild(envDiv);
  }

  // JSON Preview
  var json = buildJsonOutput(result);
  var jsonStr = JSON.stringify(json, null, 2);
  var jsonSection = document.createElement('div');
  jsonSection.innerHTML = '<div class="section-header">JSON Output</div>';
  var jsonBox = document.createElement('div');
  jsonBox.className = 'json-preview';
  jsonBox.innerHTML =
    '<button class="json-copy-btn" id="json-copy-inline" title="Copy JSON">' +
    '<img src="assets/copy.svg" alt=""> Copy' +
    '</button>' +
    '<pre><code class="language-json">' + escHtml(jsonStr) + '</code></pre>';
  jsonSection.appendChild(jsonBox);
  inner.appendChild(jsonSection);

  container.appendChild(inner);

  // Highlight the JSON block
  var codeBlock = jsonBox.querySelector('code');
  if (typeof hljs !== 'undefined') {
    hljs.highlightElement(codeBlock);
  }

  // Wire up inline copy button
  document.getElementById('json-copy-inline').addEventListener('click', function() {
    navigator.clipboard.writeText(jsonStr).then(function() {
      showToast('JSON copied to clipboard');
    });
  });

  // Store result for copy
  lastResult = result;
}

function renderField(fld) {
  var html = '';
  var tagBadge = '<span class="tag-badge">:' + escHtml(fld.tag) + ':</span>';
  var fieldName = escHtml(fld.name || 'Unknown');

  if (fld.party && typeof fld.decoded === 'object' && fld.decoded !== null) {
    // Party field — tag left, name + group right
    html += '<div class="field-row-stacked">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col">';
    html += '<div class="field-name">' + fieldName + '</div>';
    html += '<div class="parsed-field-group">';
    if (fld.decoded.account) {
      html += '<div class="group-row"><span class="group-label">Account</span><span class="group-value">' + escHtml(fld.decoded.account) + '</span></div>';
    }
    if (fld.decoded.name) {
      html += '<div class="group-row"><span class="group-label">Name</span><span class="group-value">' + escHtml(fld.decoded.name) + '</span></div>';
    }
    if (fld.decoded.address && fld.decoded.address.length > 0) {
      html += '<div class="group-row"><span class="group-label">Address</span><span class="group-value">' + fld.decoded.address.map(escHtml).join('<br>') + '</span></div>';
    }
    if (fld.decoded.countryCity) {
      html += '<div class="group-row"><span class="group-label">Country/City</span><span class="group-value">' + escHtml(fld.decoded.countryCity) + '</span></div>';
    }
    html += '</div></div></div>';
  } else if (fld.tag === '32A' && typeof fld.decoded === 'object') {
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div><div class="field-value">';
    html += '<span class="amount">' + formatAmount(fld.decoded.amount) + '</span> ';
    html += '<span class="currency-tag">' + escHtml(fld.decoded.currency) + '</span>';
    html += ' &mdash; Value date: ' + escHtml(fld.decoded.date);
    html += '</div></div></div>';
  } else if (fld.tag === '33B' && typeof fld.decoded === 'object') {
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div><div class="field-value">';
    html += '<span class="amount">' + formatAmount(fld.decoded.amount) + '</span> ';
    html += '<span class="currency-tag">' + escHtml(fld.decoded.currency) + '</span>';
    html += '</div></div></div>';
  } else if (fld.key === 'chargeBearer') {
    var chargeClass = 'charge-sha';
    if (fld.decoded === 'OUR') chargeClass = 'charge-our';
    else if (fld.decoded === 'BEN') chargeClass = 'charge-ben';
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div><div class="field-value">';
    html += '<span class="charge-badge ' + chargeClass + '">' + escHtml(fld.decoded) + '</span>';
    html += '</div></div></div>';
  } else if ((fld.tag === '71F' || fld.tag === '71G') && typeof fld.decoded === 'object') {
    var charges = Array.isArray(fld.decoded) ? fld.decoded : [fld.decoded];
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div><div class="field-value">';
    for (var c = 0; c < charges.length; c++) {
      if (c > 0) html += ', ';
      html += '<span class="amount">' + formatAmount(charges[c].amount) + '</span> ';
      html += '<span class="currency-tag">' + escHtml(charges[c].currency) + '</span>';
    }
    html += '</div></div></div>';
  } else if (fld.decoded && fld.decoded.section) {
    // Section marker (e.g. :15A:) — no value to show
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div></div>';
    html += '</div>';
  } else {
    // Simple field
    var displayValue = typeof fld.decoded === 'string' ? fld.decoded : (fld.rawValue || '');
    html += '<div class="field-row">';
    html += '<div class="field-tag-col">' + tagBadge + '</div>';
    html += '<div class="field-content-col"><div class="field-name">' + fieldName + '</div><div class="field-value">' + escHtml(displayValue) + '</div></div>';
    html += '</div>';
  }

  return html;
}

// ─── HELPERS ───
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatAmount(num) {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(message) {
  var existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2500);
}

// ─── SYNTAX HIGHLIGHTING ───
function highlightInput() {
  var input = document.getElementById('mt-input');
  var code = document.getElementById('mt-code');
  var text = input.value;

  // Custom MT highlighting: colorize tags and envelope blocks
  var highlighted = escHtml(text)
    .replace(/(\{[12345]:.*?\})/g, '<span style="color:#6C757D">$1</span>')
    .replace(/(:[0-9]{2}[A-Z]?:)/g, '<span style="color:#3AADC4;font-weight:600">$1</span>');

  code.innerHTML = highlighted;
}

function syncScroll() {
  var input = document.getElementById('mt-input');
  var pre = document.getElementById('mt-highlighted');
  pre.scrollTop = input.scrollTop;
  pre.scrollLeft = input.scrollLeft;
}

// ─── UI WIRING ───
var lastResult = null;

document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('mt-input');
  var parseBtn = document.getElementById('parse-btn');
  var fileUpload = document.getElementById('file-upload');
  var msgTypeSelect = document.getElementById('msg-type-select');
  var glossaryBtn = document.getElementById('glossary-btn');
  var copyJsonBtn = document.getElementById('copy-json-btn');
  var exportPdfBtn = document.getElementById('export-pdf-btn');

  // Textarea events
  input.addEventListener('input', function() {
    highlightInput();
  });
  input.addEventListener('scroll', syncScroll);

  // Parse button
  parseBtn.addEventListener('click', function() {
    var rawText = input.value.trim();
    if (!rawText) {
      showToast('Paste a SWIFT MT message first');
      return;
    }
    var forceType = msgTypeSelect.value === 'auto' ? null : msgTypeSelect.value;
    var result = parseMT(rawText, forceType);
    renderResults(result);
  });

  // Load sample links
  var sampleLinks = document.querySelectorAll('[data-sample]');
  for (var i = 0; i < sampleLinks.length; i++) {
    sampleLinks[i].addEventListener('click', function(e) {
      e.preventDefault();
      var sampleKey = this.getAttribute('data-sample');
      var sampleText = sampleMessages[sampleKey];
      if (sampleText) {
        input.value = sampleText;
        highlightInput();
        // Close dropdown
        UIkit.dropdown(this.closest('[uk-dropdown]')).hide(false);
      }
    });
  }

  // File upload
  fileUpload.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      input.value = ev.target.result;
      highlightInput();
    };
    reader.readAsText(file);
    fileUpload.value = '';
  });

  // Glossary modal
  glossaryBtn.addEventListener('click', function() {
    UIkit.modal('#glossary-modal').show();
  });

  // Copy JSON
  copyJsonBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!lastResult) return;
    var json = buildJsonOutput(lastResult);
    var jsonStr = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(jsonStr).then(function() {
      showToast('JSON copied to clipboard');
    });
    // Close dropdown
    var dd = this.closest('[uk-dropdown]');
    if (dd) UIkit.dropdown(dd).hide(false);
  });

  // Export PDF (placeholder)
  exportPdfBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showToast('PDF export coming in v1.1');
    var dd = this.closest('[uk-dropdown]');
    if (dd) UIkit.dropdown(dd).hide(false);
  });
});
