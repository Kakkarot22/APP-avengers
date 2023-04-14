import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

export default function Marketplace() {
  const sampleData = [
    {
      name: "Goku NFT",
      description: "MY first NFT ever created",
      website: "#",
      image:
        "https://gateway.pinata.cloud/ipfs/QmbG6HaKoFAHdocnowX6wTLYAXrnVbGHUo6oaPH1Po5Woq",
      price: "300 ETH",
      currentlySelling: "True",
      address: "",
    },
    {
      name: "Bored Ape",
      description: "",
      website: "",
      image:
        "https://gateway.pinata.cloud/ipfs/QmXxp4jKkmzJyZqcaWqSHFbJV6hnqzy6T3tcYvxR8vfxDA",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "",
    },
    {
      name: "Crypto Punks",
      description: "Most expensive NFT in this collection",
      website: "",
      image:
        "https://gateway.pinata.cloud/ipfs/Qmanu9soAytRZKpk7WxNu53UttbHXTorgwAXTiQnUEsBHF",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "",
    },
  ];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token
    let transaction = await contract.getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
    try {
      const items = await Promise.all(
        transaction.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.tokenId);
          let meta = await axios.get(tokenURI);
          meta = meta.data;

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
          return item;
        })
      );

      updateFetched(true);
      updateData(items);
    } catch (error) {}
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar />
      <div className="flex flex-col place-items-center  bg-black">
        <div className="md:text-xl font-bold text-white ">Top NFTs</div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
