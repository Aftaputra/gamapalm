// WAJIB ADA DI BARIS PALING ATAS
"use client"; 

import { useState } from 'react';
import { ethers } from 'ethers';
// Impor ikon-ikon keren buat UI
import { User, FileCode, Copy, Check, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

// =================================================================
// ==                      KONFIGURASI PENTING                    ==
// =================================================================
// ALAMAT SMART CONTRACT KAMU (GANTI SESUAI PUNYAMU)
const contractAddress = "0x47f07fb9c103Deb614D8D02915372b25EC8E95e1";

// ABI (Application Binary Interface) DARI SMART CONTRACT KAMU
// WAJIB DIISI! Copy dari file JSON hasil kompilasi (misal: CertificateNFT.json)
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			}
		],
		"name": "safeMint",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
// =================================================================


// Komponen kecil untuk menampilkan info yang bisa dicopy, biar rapi
const CopyableInfo = ({ label, value }: { label: string, value: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset ikon setelah 2 detik
    };
    
    const displayValue = value.length > 20 ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}` : value;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">{label}</label>
            <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md border">
                <code className="text-sm text-gray-800 flex-grow break-all">{displayValue}</code>
                <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-gray-200 transition-colors flex-shrink-0">
                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                </button>
            </div>
        </div>
    );
};


export default function CertificateMinter() {
    // State untuk input form
    const [nama, setNama] = useState('');
    const [pdfCid, setPdfCid] = useState('');

    // State untuk mengelola UI (loading, hasil, error)
    const [isMinting, setIsMinting] = useState(false);
    const [mintResult, setMintResult] = useState<{ hash: string; cid: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fungsi utama yang menggabungkan koneksi dan minting
    const handleMint = async () => {
        // 1. Validasi input, jangan biarkan kosong
        if (!nama || !pdfCid) {
            setError("Nama penerima dan IPFS CID wajib diisi.");
            return;
        }

        // 2. Reset state UI, aktifkan mode loading
        setIsMinting(true);
        setError(null);
        setMintResult(null);

        try {
            // 3. Cek apakah MetaMask (atau provider sejenis) ada
            if (typeof (window as any).ethereum === 'undefined') {
                throw new Error("MetaMask tidak terdeteksi. Tolong install MetaMask extension.");
            }

            // 4. Inisialisasi koneksi ke blockchain via provider dari MetaMask
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            // Minta izin ke user untuk menghubungkan wallet
            const signer = await provider.getSigner(); 
            const userAddress = await signer.getAddress();
            console.log("Terhubung dengan alamat:", userAddress);

            // 5. Buat koneksi ke smart contract
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // 6. Siapkan metadata dan Token URI
            const metadata = {
                name: `Sertifikat ISPO untuk ${nama}`,
                description: "Sertifikat digital yang membuktikan partisipasi dalam pelatihan ISPO.",
                image: `ipfs://${pdfCid}`, // Atau 'file' jika di contract pakai itu
                attributes: [
                    { "trait_type": "Penerima", "value": nama },
                    { "trait_type": "Tanggal Terbit", "value": new Date().toLocaleDateString('id-ID') }
                ]
            };
            const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

            // 7. Panggil fungsi `safeMint` di smart contract
            console.log("Membuka MetaMask untuk konfirmasi transaksi...");
            const tx = await contract.safeMint(userAddress, tokenURI);
            
            // 8. Tunggu transaksi selesai (di-mining)
            console.log("Menunggu konfirmasi transaksi...", tx.hash);
            await tx.wait();

            // 9. Jika berhasil, tampilkan hasilnya
            setMintResult({ hash: tx.hash, cid: pdfCid });

        } catch (err: any) {
            // 10. Jika ada error di mana pun, tangkap dan tampilkan pesannya
            console.error("--- PROSES MINTING GAGAL ---", err);
            setError(err.reason || err.message || "Terjadi kesalahan yang tidak diketahui.");
        } finally {
            // 11. Apapun hasilnya (sukses/gagal), matikan mode loading
            setIsMinting(false);
        }
    };

    return (
        <div className="w-full max-w-lg p-8 border rounded-xl shadow-lg bg-white transition-all">
            <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Terbitkan Sertifikat NFT</h2>
                <p className="text-sm text-gray-500 mt-1">Masukkan data untuk mencetak sertifikat ke blockchain.</p>
            </div>

            <div className="flex flex-col gap-5">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Nama Perusahaan/Penerima"
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="relative">
                    <FileCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="IPFS Content ID (CID) dari PDF"
                        value={pdfCid} 
                        onChange={(e) => setPdfCid(e.target.value)} 
                        className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            <button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold transition-colors text-base shadow-md"
            >
                {isMinting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mencetak...</span>
                    </>
                ) : (
                    'Mint Sertifikat'
                )}
            </button>

            <div className="mt-6 min-h-[90px]">
                {error && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {mintResult && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="text-md font-semibold text-green-800 mb-3">✅ Minting Berhasil!</h3>
                        <div className="flex flex-col gap-3">
                            <CopyableInfo label="Transaction Hash" value={mintResult.hash} />
                            <CopyableInfo label="IPFS Content ID (CID)" value={mintResult.cid} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}