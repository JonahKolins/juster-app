import React, { useMemo, useState } from 'react';
import styles from './MyClaimsTable.module.sass';
import { Modal, Table, Tag, Tooltip } from 'antd';
import { useClaims } from 'app/hooks/useClaims';
import type { ColumnsType } from 'antd/es/table';
import { datetimeUtils } from 'core/utils/datetimeUtils';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IClaimFileInfo, IClaimsItem, IClaimStatus } from 'classes/claim/Claim.Types';
import { useNavigate } from 'react-router';
import { TbGrid3X3 } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { RxClock } from "react-icons/rx";
import { RxCounterClockwiseClock } from "react-icons/rx";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { LuGoal } from "react-icons/lu";
import { PiScales } from "react-icons/pi";
import { useProfile } from 'app/hooks/useProfile';
import { TbArrowsDiagonal } from "react-icons/tb";
import { IoClose, IoCalendarClearOutline, IoDocumentOutline, IoPersonOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";

interface ClaimTableRowData {
    key: React.Key;
    id: string;
    name: string;
    user: string,
    respondent?: string,
    lawyer?: string,
    createdAt: string;
    lastUpdate?: string;
    status: string;
    files: IClaimFileInfo[];
}

const OPEN_FULL_CLAIM = 'К обращению';
const CONTINUE_CREATE_CLAIM = 'Продолжить создание';

const MyClaimsTable = () => {
    const navigate = useNavigate();
    const { clientInfo } = useProfile();
    const { claims, isClaimsLoading, isClaimsReady } = useClaims();

    const [selectedClaim, setSelectedClaim] = useState<IClaimsItem>(null);
    const [isClaimItemModalOpen, setIsClaimItemModalOpen] = useState<boolean>(false);

    const columns: ColumnsType<ClaimTableRowData> = [
        {
            title: 'Название',
            dataIndex: 'name',
            ellipsis: {
                showTitle: true,
            },
            render: (name: string, record: ClaimTableRowData) => (
                <span className={styles['claim-name']} onClick={(e) => handleClaimNameClick(e, record)}>{name}</span>
            ),
        },
        {
            title: 'Участники',
            dataIndex: 'participants',
            width: 160,
            render: (_, record: ClaimTableRowData) => renderParticipants(record)
        },
        {
            title: 'Создано',
            dataIndex: 'createdAt',
            width: 160,
            render: (createdAt) => createdAt
        },
        {
            title: 'Обновлено',
            dataIndex: 'lastUpdate',
            width: 160,
            render: (lastUpdate) => lastUpdate
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            width: 160,
            render: (_, {status}) => renderStatusTag(status as IClaimStatus),
        },
        {
            title: '',
            dataIndex: 'id',
            width: 40,
            render: () => (
                <div className={styles['my-claims-table-dots']} onClick={handleDotsClick}>
                    <HiOutlineDotsVertical />
                </div>
            )
        }
    ]

    const handleClaimNameClick = (e: React.MouseEvent<HTMLSpanElement>, record: ClaimTableRowData) => {
        console.log('claim name clicked');
        e.stopPropagation();
        e.preventDefault();
        navigate(`/mySpace/claims/${record.id}`)
    }

    const handleDotsClick = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log('dots clicked');
        e.stopPropagation();
        e.preventDefault();
    }

    const renderParticipants = (record: ClaimTableRowData): React.JSX.Element => {
        return (
            <div className={styles['my-claims-table-participants']}>
                <Tooltip placement="topRight" title={`${record.user}, вы`} arrow={true}>
                    <div className={styles['participant-item']}>
                        <IoPersonOutline size={13} />
                    </div>
                </Tooltip>
                <Tooltip placement="top" title={record.lawyer ? `${record.lawyer}, юрист` : 'Юрист не назначен'} arrow={true}>
                    <div className={styles['participant-item']}>
                        <PiScales size={13} />
                    </div>
                </Tooltip>
                <Tooltip placement="topLeft" title={record.respondent ? `${record.respondent}, ответчик` : 'Ответчик не указан'} arrow={true}>
                    <div className={styles['participant-item']}>
                        <HiOutlineBuildingLibrary size={13} />
                    </div>
                </Tooltip>
            </div>
        )
    }

    const renderStatusTag = (status: IClaimStatus): React.JSX.Element => {
        switch (status) {
            case IClaimStatus.resolved: {
                return (
                    <Tag color='green'>Готово</Tag>
                )
            }
            case IClaimStatus.declined: {
                return (
                    <Tag color='volcano'>Отклонено</Tag>
                )
            }
            case IClaimStatus.new: {
                return (
                    <Tag color='geekblue'>Создано</Tag>
                )
            }
            case IClaimStatus.inProgress: {
                return (
                    <Tag color='blue'>В процессе</Tag>
                )
            }
            case IClaimStatus.draft: {
                return (
                    <Tag color='geekblue'>Черновик</Tag>
                )
            }
            case IClaimStatus.open: {
                return (
                    <Tag color='blue'>На рассмотрении</Tag>
                )
            }
            case IClaimStatus.needInfo: {
                return (
                    <Tag color='orange'>Требуется действие</Tag>
                )
            }
            default: {
                // @ts-ignore
                if (status === 'created') {
                    return <Tag color='geekblue'>Создано</Tag>
                }
                return <Tag color='geekblue'>{status}</Tag>
            }
        }
    }

    const tableRows = useMemo<ClaimTableRowData[]>(() => {
        if (!claims?.length || isClaimsLoading) return [];

        const claimsToRender = claims;

        const rowsArray: ClaimTableRowData[] = claimsToRender.map((item) => {
            return {
                key: item.genId,
                id: item.genId,
                name: item.claimInfo.claimName ? item.claimInfo.claimName : item.claimInfo.contentType,
                status: item.claimInfo.status,
                user: clientInfo?.firstName ? `${clientInfo.firstName} ${clientInfo.lastName}` : clientInfo?.email,
                respondent: item.claimInfo.recipientName,
                files: item.claimInfo.files,
                lawyer: 'Юра',
                createdAt: datetimeUtils.formatTime(item.claimInfo.createdAt, 'DD.MM.YYYY'),
                lastUpdate: datetimeUtils.formatTime(item.claimInfo.lastUpd, 'DD.MM.YYYY'),
            }
        })

        return rowsArray;
    }, [claims, isClaimsLoading])

    const onRowClick = (record: ClaimTableRowData) => {
        const claim = claims.find((claim) => claim.genId === record.id);
        
        if (claim) {
            setSelectedClaim(claim);
            setIsClaimItemModalOpen(true);
        }
    }

    const handleClaimItemModalClose = () => {
        setIsClaimItemModalOpen(false);
        setSelectedClaim(null);
    }

    console.log('selectedClaim', selectedClaim);
    
    const renderModalTitle = (): JSX.Element => {
        return (
            <div className={styles['my-claims-modal-title-container']}>
                {selectedClaim && selectedClaim.claimInfo.status == IClaimStatus.draft 
                    ? (
                        <>
                            <div className={styles['title-button']} onClick={handleContinueToCreateClaim}>
                                <IoCreateOutline size={16} className={styles['title-button-icon']} />
                                <span className={styles['title-button-text']}>{CONTINUE_CREATE_CLAIM}</span>
                            </div>
                            <Tooltip placement="bottom" title={'Удалить'} arrow={true}>
                                <div className={styles['title-button']} onClick={handleContinueToCreateClaim}>
                                    <IoTrashOutline size={16} className={styles['title-button-icon']} />
                                </div>
                            </Tooltip>
                        </>
                    )
                    : (
                        <div className={styles['title-button']} onClick={handleOpenFullClaim}>
                            <TbArrowsDiagonal size={16} className={styles['title-button-icon']} />
                            <span className={styles['title-button-text']}>{OPEN_FULL_CLAIM}</span>
                        </div>
                    )
                }
            </div>  
        )
    }

    const handleOpenFullClaim = () => {
        console.log('open full claim');
        navigate(`/mySpace/claims/${selectedClaim.genId}`)
    }

    const handleContinueToCreateClaim = () => {
        if (!selectedClaim) return;
        navigate(`/mySpace/newClaim?claimId=${encodeURIComponent(selectedClaim.genId)}`);
    }

    const renderCloseIcon = (): React.ReactNode => {
        return (
            <div className={styles['close-icon']}>
                <IoClose size={18} />
            </div>
        )
    }

    const renderCustomModal = (modal: React.ReactNode): React.ReactNode => {
        return (
            <div className={styles['my-claims-custom-render-modal']}>
                {modal}
            </div>
        )
    }

    const getStatusName = (status: IClaimStatus): string => {
        switch (status) {
            case IClaimStatus.draft: return 'Черновик';
            case IClaimStatus.new: return 'Создано';
            case IClaimStatus.open: return 'На рассмотрении';
            case IClaimStatus.inProgress: return 'В процессе';
            case IClaimStatus.needInfo: return 'Требуется действие';
            case IClaimStatus.resolved: return 'Решено';
            case IClaimStatus.declined: return 'Отклонено';
            default: return '';
        }
    }

    const renderModalContent = (): React.ReactNode => {
        if (!selectedClaim) return null;
        return (
            <div className={styles['my-claims-modal']}>
                <div className={styles['modal-claim-name']}>
                    {selectedClaim.claimInfo.claimName ? selectedClaim.claimInfo.claimName : selectedClaim.claimInfo.contentType}
                </div>
                <table className={styles['about-table']}>
                    <tbody>
                        <tr>
                            <td className={styles['key']}>
                                <TbGrid3X3 />
                                <span>Идентификатор</span>
                            </td>
                            <td className={styles['value']}>{selectedClaim.genId}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>
                                <HiOutlineClipboardDocumentList />
                                <span>Причина</span>
                            </td>
                            <td className={styles['value']}>{selectedClaim.claimInfo.contentType}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>
                                <RxClock />
                                <span>Текущий статус</span>
                            </td>
                            <td className={styles['value']}>{renderStatusTag(selectedClaim.claimInfo.status as IClaimStatus)}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>
                                <IoCalendarClearOutline />
                                <span>Дата создания</span>
                            </td>
                            <td className={styles['value']}>{datetimeUtils.formatTime(selectedClaim.claimInfo.createdAt, 'DD.MM.YYYY')}</td>
                        </tr>
                        <tr>
                            <td className={styles['key']}>
                                <RxCounterClockwiseClock />
                                <span>Последнее обновление</span>
                            </td>
                            <td className={styles['value']}>{datetimeUtils.formatTime(selectedClaim.claimInfo.lastUpd, 'DD.MM.YYYY')}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles['modal-claim-respondent']}>
                    <div className={styles['modal-claim-title']}>Ответчик</div>
                    <table className={styles['about-table']}>
                        <tbody>
                            <tr>
                                <td className={styles['key']}>
                                    <HiOutlineBuildingLibrary />
                                    <span>Название</span>
                                </td>
                                <td className={styles['value']}>{selectedClaim.claimInfo.recipientName}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>
                                    <LuGoal />
                                    <span>Адресс</span>
                                </td>
                                <td className={styles['value']}>{selectedClaim.claimInfo.recipientAddress}</td>
                            </tr>
                            <tr>
                                <td className={styles['key']}>
                                    <IoDocumentOutline />
                                    <span>ИНН</span>
                                </td>
                                <td className={styles['value']}>{selectedClaim.claimInfo.recipientInn}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles['modal-claim-description']}>
                    <div className={styles['modal-claim-title']}>Описание</div>
                    <div 
                        className={styles['modal-claim-text']}
                        dangerouslySetInnerHTML={{__html: selectedClaim.claimInfo.textClaim}}
                    />
                </div>
                <div className={styles['modal-claim-attachments']}>
                    <div className={styles['modal-claim-title']}>Вложения</div>
                    <div className={styles['modal-claim-attachments-items']}>
                        {selectedClaim.claimInfo.files?.map((fileInfo) => (
                            // TODO тут не хватает файлов потому что в запросе claims у обращения нет поля files
                            <div className={styles['modal-claim-attachment-item']}>{fileInfo.fileName}</div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={styles['my-claims-table']}>
                <Table
                    columns={columns}
                    dataSource={tableRows}
                    loading={isClaimsLoading}
                    rowKey={(record) => record.id}
                    pagination={false}
                    scroll={{ y: '100%' }}
                    bordered={true}
                    rowHoverable={true}
                    onRow={(record) => ({
                        onClick: () => onRowClick(record)
                    })}
                    size='middle'
                />
            </div>
            <Modal 
                open={isClaimItemModalOpen} 
                title={renderModalTitle()} 
                footer={null} 
                style={{ position: 'absolute', top: 20, right: 20, minWidth: 640 }}
                onCancel={handleClaimItemModalClose}
                closeIcon={renderCloseIcon()}
                modalRender={renderCustomModal}
            >
                {renderModalContent()}
            </Modal>
        </>
    )
}

export default MyClaimsTable;