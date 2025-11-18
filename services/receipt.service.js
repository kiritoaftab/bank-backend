import PDFDocument from "pdfkit";
import moment from "moment";
import { uploadPdfToAzureWithSAS } from "../utils/azureUpload.js";
import {
  Transaction,
  Customer,
  Agent,
  Account,
  User,
  Loan,
} from "../models/index.js";

// 2-inch thermal paper width = ~144 points
const PAPER_WIDTH = 144;

export async function generateTransactionPdf(transactionId) {
  // Fetch transaction + relational data
  const txn = await Transaction.findByPk(transactionId, {
    include: [
      { model: Customer, include: [{ model: User }] },
      { model: Agent, include: [{ model: User }] },
      { model: Account },
      { model: Loan },
    ],
  });

  if (!txn) throw new Error("Transaction not found");

  const customer = txn.Customer?.User;
  const agent = txn.Agent?.User;
  const account = txn.Account ?? txn.Loan;
  console.log(customer, agent, account, "Retrived");

  // Begin PDF generation
  const doc = new PDFDocument({
    size: [PAPER_WIDTH, 200], // 2-inch width, height auto-expands
    margins: { top: 10, bottom: 10, left: 5, right: 5 },
  });

  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {});

  // HEADER
  doc.fontSize(12).text("ACME BANK", { align: "center" });
  doc.fontSize(8).text("980980980", { align: "center" });
  doc.moveDown();

  doc.moveTo(0, doc.y).lineTo(PAPER_WIDTH, doc.y).stroke();

  doc.moveDown(0.5);

  // DETAILS
  doc.fontSize(8);

  doc.text(`Transaction ID : ${txn.id}`);

  doc.text(`Customer: ${customer.firstName} ${customer.lastName}`);
  doc.text(`Customer ID: ${txn.customer_id}`);

  doc.text(`Agent: ${agent.firstName} ${agent.lastName}`);
  doc.text(`Agent ID: ${txn.agent_id}`);

  if (account) {
    doc.text(`Account No: ${account.accountNumber}`);
    doc.text(`Balance: ${account.balance ?? account.pendingDue}`);
  } else {
    doc.text(`Account No: N/A`);
    doc.text(`Balance: N/A`);
  }

  doc.text(`Amount: ${txn.amount}`);
  doc.text(`Mode: ${txn.mode}`);
  doc.text(`Date: ${moment(txn.createdAt).format("DD-MM-YYYY HH:mm A")}`);

  doc.moveDown();
  doc.moveTo(0, doc.y).lineTo(PAPER_WIDTH, doc.y).stroke();

  doc.moveDown(1);
  doc.fontSize(9).text("Thank you for saving with us", { align: "center" });

  const pdfBuffer = await generatePdfBuffer(doc);

  // Upload to Azure
  const fileName = `receipts/txn_${transactionId}_${Date.now()}.pdf`;
  const url = await uploadPdfToAzureWithSAS(pdfBuffer, fileName);
  const fileLink = url.split("?");
  return { url: fileLink[0] };
}

function generatePdfBuffer(doc) {
  return new Promise((resolve, reject) => {
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    doc.end();
  });
}
