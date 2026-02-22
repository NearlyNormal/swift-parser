# swift-message-parser

> Parse raw SWIFT MT messages into clean, human-readable JSON. Runs entirely in your browser. No install, no server, no dependencies.

---

## What It Does

Paste a raw SWIFT MT103 or MT202 message into the tool, and get back:

- **Structured JSON:** every field tag decoded and labelled
- **Human-readable field names:** `:32A:` becomes `Value Date / Currency / Amount`
- **Field-level validation:** missing mandatory fields, invalid formats, unknown tags
- **Envelope decoding:** sender BIC, receiver BIC, message direction from header blocks

---

## Supported Message Types

| Type | Name | Status |
|---|---|---|
| MT103 | Single Customer Credit Transfer | ✓ v1.0 |
| MT202 | General Financial Institution Transfer | ✓ v1.0 |
| MT202 COV | Cover Payment | Planned v1.1 |
| MT199 | Free Format Message | Planned v1.1 |
| MT900 | Confirmation of Debit | Planned v1.2 |
| MT910 | Confirmation of Credit | Planned v1.2 |
| MT940 | Customer Statement Message | Planned v1.2 |
| MT950 | Statement Message | Planned v1.2 |

---

## Quick Start

No install required.

```bash
git clone https://github.com/shanx/swift-message-parser
cd swift-message-parser
open index.html
```

Or just open `index.html` directly in any modern browser.

Paste a raw MT message. Click Parse. Done.

---

## Example

**Input: raw MT103**

```
{1:F01NWBKGB2LAXXX0000000000}
{2:I103COBADEFFXXXXN}
{4:
:20:SHANX-20250101-001
:23B:CRED
:32A:250101USD10000,00
:50K:/GB29NWBK60161331926819
Acme Corporation
1 Canada Square
London E14 5AB
:59:/DE89370400440532013000
Global Trade Bank
Neue Mainzer Str 32
Frankfurt 60311
:70:INVOICE REF 2025-INV-0042
:71A:SHA
-}
```

**Output: structured JSON**

```json
{
  "messageType": "MT103",
  "transactionReference": "SHANX-20250101-001",
  "bankOperationCode": "CRED",
  "valueDate": "2025-01-01",
  "currency": "USD",
  "amount": 10000.00,
  "orderingCustomer": {
    "account": "GB29NWBK60161331926819",
    "name": "Acme Corporation",
    "address": ["1 Canada Square", "London E14 5AB"]
  },
  "beneficiary": {
    "account": "DE89370400440532013000",
    "name": "Global Trade Bank",
    "address": ["Neue Mainzer Str 32", "Frankfurt 60311"]
  },
  "remittanceInformation": "INVOICE REF 2025-INV-0042",
  "chargeBearer": "SHA",
  "_meta": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "parsedAt": "2025-01-01T09:00:00Z"
  }
}
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| UI | Vanilla HTML + CSS | Zero dependencies, open and run |
| Logic | Vanilla JavaScript (ES6+) | Runs in browser, no compile step |
| Text parsing | Native JS string + regex | MT format is plain text, no library needed |
| Syntax highlighting | `highlight.js` (CDN) | JSON output colouring |
| CSS framework | UIKit 3 (CDN) | Navbar, dropdowns, modals |
| Fonts | IBM Plex Mono + Sans | Trading-terminal aesthetic |

**One HTML file. No npm. No build step. No server.**

---

## Architecture

```
swift-parser/
├── index.html              # Entry point: navbar, split panels, modals
├── assets/
│   ├── style.css           # Design system (CSS custom properties)
│   ├── app.js              # Parser engine, schemas, samples, UI logic
│   └── *.svg               # Icon assets
├── samples/
│   ├── mt103-sample.txt    # Reference MT103 sample
│   └── mt202-sample.txt    # Reference MT202 sample
└── README.md
```

---

## How the Parser Works

SWIFT MT messages are plain text with a consistent structure: each field starts with a `:TAG:` identifier on a new line, followed by its value. The parser:

1. **Extracts envelope blocks:** parses `{1:...}` basic header and `{2:...}` application header for sender/receiver BIC and message type
2. **Isolates the text block:** extracts `{4:...-}` containing the actual message fields
3. **Splits on field tags:** regex splits on `:XX:` or `:XXX:` patterns, handling multi-line values
4. **Maps tags to definitions:** each tag is looked up in a shared field dictionary with human-readable names
5. **Decodes compound fields:** `:32A:` encodes date + currency + amount in one value. These are decoded into separate fields
6. **Validates mandatory fields:** each message type has required tags. Missing ones surface as errors

---

## Field Tag Reference

| Tag | Name | Format | Notes |
|---|---|---|---|
| `:20:` | Transaction Reference | 16x | Mandatory. Unique reference assigned by sender |
| `:21:` | Related Reference | 16x | Reference to a related message |
| `:23B:` | Bank Operation Code | 4!a | Mandatory. Usually `CRED` for credit transfers |
| `:32A:` | Value Date / Currency / Amount | 6!n3!a15d | Mandatory. Date in YYMMDD, ISO 4217 currency, decimal amount |
| `:50K:` | Ordering Customer | 4\*35x | Account + name + address of sending party |
| `:52A:` | Ordering Institution | BIC | Sender's bank BIC |
| `:57A:` | Account With Institution | BIC | Beneficiary's bank BIC |
| `:59:` | Beneficiary Customer | 4\*35x | Account + name + address of receiving party |
| `:70:` | Remittance Information | 4\*35x | Payment reference / invoice details |
| `:71A:` | Details of Charges | 3!a | `SHA` shared / `OUR` sender pays / `BEN` beneficiary pays |
| `:72:` | Sender to Receiver Information | 6\*35x | Optional free-text instructions |

---

## Features Roadmap

### v1.0: Launch
- [x] MT103 full field parsing and decoding
- [x] MT202 full field parsing and decoding
- [x] Mandatory field validation
- [x] Envelope block parsing (`{1:...}` `{2:...}` headers)
- [x] Compound field decoding (`:32A:` date/currency/amount split)
- [x] Custom MT syntax highlighting
- [x] Load sample message button
- [x] Copy JSON to clipboard
- [x] Dark-mode-ready design system

### v1.1: Coverage
- [ ] MT202 COV (cover payments)
- [ ] MT199 free format
- [ ] IBAN format validation
- [ ] BIC/SWIFT code format validation
- [ ] Plain English summary panel
- [ ] PDF export

### v1.2: Statement messages
- [ ] MT940 Customer Statement
- [ ] MT950 Statement Message
- [ ] MT900 / MT910 debit/credit confirmations
- [ ] Batch parse: paste multiple messages separated by `$`

---

## Future / Vision

This tool deliberately stays as a single HTML file with vanilla JavaScript. Browsers run JS, not TypeScript, and a build/compile step would break the "open and use" simplicity that makes it genuinely useful.

**Phase 1: Browser tool (this repo, v1.x)**
Single HTML file. Paste and parse. No install.

**Phase 2: TypeScript library**
The parsing logic extracted into a typed npm package with proper interfaces for each message type.

**Phase 3: REST API**
A Fastify + TypeScript wrapper around the library for server-side parsing.

**Phase 4: Integration with RegWatch**
MT103/MT202 parsing becomes one module in the broader regulatory intelligence stack.

---

## MT Message Format Reference

SWIFT MT messages are organised into **categories** by the first digit of the message type number.

<details>
<summary><strong>Category 1: Customer Payments & Cheques</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT101 | Request for Transfer | Medium |
| MT103 | Single Customer Credit Transfer | ✅ v1.0 |
| MT103 STP | Straight Through Processing variant | v1.1 |
| MT103 REMIT | Extended remittance info variant | v1.1 |
| MT104 | Direct Debit & Request for Debit Transfer | Low |
| MT107 | General Direct Debit Message | Low |
| MT110 | Advice of Cheque | Low |
| MT111 | Request for Stop Payment of Cheque | Low |
| MT112 | Status of a Request for Stop Payment | Low |

</details>

<details>
<summary><strong>Category 2: Financial Institution Transfers</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT200 | Financial Institution Transfer for Own Account | Medium |
| MT201 | Multiple FI Transfer for Own Account | Low |
| MT202 | General Financial Institution Transfer | ✅ v1.0 |
| MT202 COV | Cover Payment | v1.1 |
| MT203 | Multiple General FI Transfer | Low |
| MT204 | Financial Markets Direct Debit | Low |
| MT205 | Financial Institution Transfer Execution | Medium |
| MT210 | Notice to Receive | Medium |

</details>

<details>
<summary><strong>Category 3: Treasury & Derivatives</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT300 | FX Confirmation | High |
| MT304 | Advice/Instruction of FX Deal | Medium |
| MT305 | FX Option Confirmation | Medium |
| MT320 | Fixed Loan/Deposit Confirmation | Medium |
| MT330 | Call/Notice Loan/Deposit Confirmation | Low |
| MT340 | Forward Rate Agreement Confirmation | Low |
| MT360 | Single Currency Interest Rate Swap | Low |
| MT361 | Cross Currency Interest Rate Swap | Low |

</details>

<details>
<summary><strong>Category 4: Collections & Cash Letters</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT400 | Advice of Payment | Low |
| MT410 | Acknowledgement | Low |
| MT412 | Advice of Acceptance | Low |
| MT430 | Amendment of Instructions | Low |
| MT450 | Cash Letter Credit Advice | Low |
| MT456 | Advice of Dishonour | Low |

</details>

<details>
<summary><strong>Category 5: Securities</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT500–599 | Securities messages (confirmations, instructions, statements) | Low for v1 |

</details>

<details>
<summary><strong>Category 6: Precious Metals & Syndications</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT600–699 | Precious metals, syndicated loans | Very low |

</details>

<details>
<summary><strong>Category 7: Documentary Credits & Guarantees</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT700 | Issue of Documentary Credit (Letter of Credit) | Medium |
| MT707 | Amendment to Documentary Credit | Medium |
| MT710 | Advice of Third Bank's Documentary Credit | Low |
| MT740 | Authorisation to Reimburse | Low |
| MT742 | Reimbursement Claim | Low |
| MT760 | Guarantee / Standby Letter of Credit | Medium |
| MT767 | Guarantee Amendment | Low |

</details>

<details>
<summary><strong>Category 9: Cash Management & Customer Status</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT900 | Confirmation of Debit | High |
| MT910 | Confirmation of Credit | High |
| MT920 | Request Message | Medium |
| MT940 | Customer Statement Message | High |
| MT941 | Balance Report | Medium |
| MT942 | Interim Transaction Report | Medium |
| MT950 | Statement Message (FI to FI) | High |
| MT970 | Netting Statement | Low |

</details>

<details>
<summary><strong>Common Group Messages</strong></summary>

| Type | Name | Priority |
|---|---|---|
| MT190/191 | Charges / Request for Payment | Low |
| MT192/195/196 | Cancellation / Queries / Answers | Medium |
| MT199 | Free Format | Medium |
| MT292/295/296 | Same as above for Cat 2 | Low |
| MT999 | Free Format (general) | Medium |

</details>

---

## Tags

`swift` `mt103` `mt202` `payments` `fintech` `banking` `correspondent-banking` `message-parser` `open-banking` `iso15022`
