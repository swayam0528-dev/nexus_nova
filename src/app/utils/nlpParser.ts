import { ParsedIntent } from '../types';

export function parseUserInput(input: string): ParsedIntent {
  const lowerInput = input.toLowerCase();

  // Intent Detection
  let action: ParsedIntent['action'] = 'unknown';
  let confidence = 0;

  // Create Order Intent
  if (
    /create|new|add|make|place.*order/i.test(input) ||
    /order.*for/i.test(input) ||
    /need|want|require.*\d+/i.test(input)
  ) {
    action = 'create_order';
    confidence = 0.8;
  }
  // Update Status Intent
  else if (
    /update|change|set.*status/i.test(input) ||
    /mark.*as|move.*to/i.test(input) ||
    /(received|in review|accepted)/i.test(input) && /order/i.test(input)
  ) {
    action = 'update_status';
    confidence = 0.85;
  }
  // Add Quality Note Intent
  else if (
    /quality|defect|issue|problem|note|remark/i.test(input) ||
    /add.*note|report/i.test(input)
  ) {
    action = 'add_quality_note';
    confidence = 0.8;
  }
  // Query Intent
  else if (
    /show|list|display|view|what|status|where/i.test(input)
  ) {
    action = 'query';
    confidence = 0.7;
  }

  // Entity Extraction
  const entities: ParsedIntent['entities'] = {};

  // Extract Order ID (ORD-XXXX or #XXXX format)
  const orderIdMatch = input.match(/(?:order\s*)?(?:#|ORD-)?\s*(\d+)/i);
  if (orderIdMatch) {
    entities.orderId = `ORD-${orderIdMatch[1].padStart(4, '0')}`;
  }

  // Extract Part Name (capitalize words)
  const partPatterns = [
    /(?:part|component|item)(?:\s+name)?(?:\s+is)?[:\s]+([a-z\s]+?)(?=\s+(?:material|quantity|deadline|,|$))/i,
    /for\s+([a-z\s]+?)(?=\s+(?:made|using|with|material|quantity|deadline|,|$))/i,
  ];
  for (const pattern of partPatterns) {
    const match = input.match(pattern);
    if (match) {
      entities.partName = match[1].trim().split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      break;
    }
  }

  // Extract Material
  const materialPatterns = [
    /(?:material|made\s+of|using|with)[:\s]+([a-z\s]+?)(?=\s+(?:quantity|deadline|,|$))/i,
    /(steel|aluminum|plastic|iron|copper|brass|titanium|carbon\s+fiber)/i,
  ];
  for (const pattern of materialPatterns) {
    const match = input.match(pattern);
    if (match) {
      entities.material = match[1].trim().split(' ').map(w =>
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      break;
    }
  }

  // Extract Quantity
  const quantityMatch = input.match(/(?:quantity|qty|amount|need|want|require)[:\s]*(\d+)|(\d+)\s+(?:units|pieces|pcs)/i);
  if (quantityMatch) {
    entities.quantity = parseInt(quantityMatch[1] || quantityMatch[2]);
  }

  // Extract Deadline (various date formats)
  const deadlinePatterns = [
    /(?:deadline|due|by|before)[:\s]+(\d{4}-\d{2}-\d{2})/i,
    /(?:deadline|due|by|before)[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(?:deadline|due|by|before)[:\s]+((?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4})/i,
  ];
  for (const pattern of deadlinePatterns) {
    const match = input.match(pattern);
    if (match) {
      entities.deadline = match[1].trim();
      break;
    }
  }

  // Extract Status
  if (/received/i.test(input)) {
    entities.status = 'Received';
  } else if (/in\s*review/i.test(input)) {
    entities.status = 'In Review';
  } else if (/accepted/i.test(input)) {
    entities.status = 'Accepted';
  }

  // Extract Quality Note (for quality note intent)
  if (action === 'add_quality_note') {
    // Try to extract the actual note content
    const notePatterns = [
      /(?:note|remark|issue|problem|defect)[:\s]+(.+?)$/i,
      /(?:quality|report)[:\s]+(.+?)$/i,
    ];
    for (const pattern of notePatterns) {
      const match = input.match(pattern);
      if (match) {
        entities.qualityNote = match[1].trim();
        break;
      }
    }
    // If no specific pattern matched, use the whole message as note
    if (!entities.qualityNote) {
      entities.qualityNote = input;
    }
  }

  return {
    action,
    entities,
    confidence,
  };
}
