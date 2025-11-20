import styles from '../../../styles/SmartContractDetails.module.scss'
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';


export const ContractCode = ({ contractName, closingConditions }: { contractName: string, closingConditions: Array<any> }) => {
  const len = closingConditions.length
  const [expandedConditions, setExpandedConditions] = useState<{ [key: number]: boolean }>({});
  const toggleExpand = (index: number) => {
    setExpandedConditions(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Code copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
  const copyUrlWithId = (index: number) => {
    const url = `${window.location.origin}${window.location.pathname}#code-${index}`;
    copyToClipboard(url);
  };


  return (
    <div className={styles.codeContainer}>
      <div className={styles.header}>
        <div className={styles.verify}>
          <p>Contract Source Code Verified</p>
          <span>(Perfect match)</span>
          <Image src={'/icon_ok.png'}
            alt='verified'
            width={18}
            height={18}
          />
        </div>
        <div className={styles.box}>
          <div className={styles.wrap}>
            <div className={styles.label}>Contract name:</div>
            <div className={styles.value}>{contractName.substring(1, 24)}</div>
          </div>
          <div className={styles.wrap}>
            <div className={styles.label}>Optimisation:</div>
            <div className={styles.value}>No</div>
          </div>
          <div className={styles.wrap}>
            <div className={styles.label}>Compiler version:</div>
            <div className={styles.value}>solidity 0.4.25</div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        {closingConditions.map((condition, index) => {
          const conditionString = JSON.stringify(condition, null, 2);
          const isExpanded = expandedConditions[index];
          const lines = conditionString.split('\n');
          return (
            <>
              <div key={index} className={styles.label} id={`code-${index}`}>
                <p>
                  File {index + 1} (of {len}): BasicToken.sol
                </p>
                <div className={styles.right}>
                  <Image src={'/copy.svg'}
                    alt='icon'
                    width={18}
                    height={18}
                    onClick={() => copyToClipboard(conditionString)}

                  />
                  <Image src={'/link.svg'}
                    alt='icon'
                    width={18}
                    height={18}
                  />
                  {lines.length > 20 && (
                    <Image
                      src={isExpanded ? '/compress.svg' : '/expand.svg'}
                      alt={isExpanded ? 'compress' : 'expand'}
                      width={20}
                      height={20}
                      onClick={() => toggleExpand(index)}
                      className={styles.expandIcon}
                    />
                  )}
                </div>
              </div>
              <pre>
                {isExpanded ? conditionString : lines.slice(0, 20).join('\n')}
                {!isExpanded && lines.length > 20 && '...'}
              </pre>
            </>
          )
        })}
      </div>
    </div>
  );
};