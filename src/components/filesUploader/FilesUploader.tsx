import React, { useState, useCallback, useEffect } from 'react';
import { ClaimCreator } from 'classes/claim/ClaimCreator';
import { IoClose } from "react-icons/io5";
import { HiPlus } from "react-icons/hi2";
import { BsFiletypePdf, BsFiletypeJpg, BsFileEarmarkWord, BsFiletypePng, BsFileEarmark } from "react-icons/bs";
import { CiFileOn } from "react-icons/ci";
import styles from './FilesUploader.module.sass';

interface FileData {
  id: string;
  file: File;
}

interface FilesUploaderProps {
    onChange: () => void;
    viewMode?: boolean;
}

const FilesUploader = React.memo<FilesUploaderProps>(({onChange, viewMode}) => {

    const createFilesData = (files: File[]): FileData[] => {
        if (!files?.length) return [];
        return files.map(file => {
            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
            }
        });
    }

    const [files, setFiles] = useState<FileData[]>(createFilesData(ClaimCreator.instance.claimInfo.files || []));

    useEffect(() => {
        ClaimCreator.instance.claimCreatorDataChanged.subscribe(handleClaimCreatorDataChanged);
        handleClaimCreatorDataChanged();
    }, [])

    const handleClaimCreatorDataChanged = () => {
        const savedFiles = ClaimCreator.instance.claimInfo.files || [];
        setFiles(createFilesData(savedFiles));
    }

    // реакция на добавление файла
    const handleAddFiles = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        console.log('newFiles', newFiles);
        const newFileData = createFilesData(newFiles);
        //
        setFiles(prev => [...prev, ...newFileData]);
        handleSaveFiles(newFiles);
        //
        event.target.value = '';
        onChange();
    }, [files]);

    // загружаем на сервер
    const handleSaveFiles = useCallback(async (filesToUpload: File[]) => {
        console.log('filesToUpload', filesToUpload);
        try {
            await ClaimCreator.instance.saveFiles(filesToUpload);
        } catch (error) {
            console.error('Save files error:', error);
        }
    }, []);

    // удаляем файл
    const handleDelete = useCallback(async (fileId: string) => {
        try {
            setFiles(prev => prev.filter(f => f.id !== fileId));
            await ClaimCreator.instance.deleteFile(fileId);
        } catch (error) {
            console.error('Delete file error:', error);
        }
    }, []);

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <BsFiletypePdf />;
        if (type.includes('word')) return <BsFileEarmarkWord />;
        if (type.includes('jpeg')) return <BsFiletypeJpg />;
        if (type.includes('png')) return <BsFiletypePng />;
        return <BsFileEarmark />;
    };

    return (
        <div className={styles.container}>
            <div className={styles.filesGrid}>
                {files.map(({ id, file }) => (
                    <div key={id} className={styles.fileCard}>
                        <div className={styles.fileIcon}>{getFileIcon(file.type)}</div>
                        <div className={styles.infoContainer}>
                            <span className={styles.fileName}>{file.name}</span>
                            <div className={styles.fileSize}>{`${(file.size/(1024*1024)).toFixed(2)} Мб`}</div>
                        </div>
                        {!viewMode && (
                            <div
                                className={styles.deleteButton}
                                onClick={() => handleDelete(id)}
                                aria-label="Delete file"
                            >
                                <IoClose size={18}/>
                            </div>
                        )}
                    </div>
                ))}
                {!viewMode && (
                    <label className={styles.addButton}>
                        <input
                            type="file"
                            multiple
                            onChange={handleAddFiles}
                            className={styles.hiddenInput}
                        />
                        <span className={styles.plusIcon}>
                            <HiPlus size={22}/>
                        </span>
                    </label>
                )}
            </div>
        </div>
    );
});

export default FilesUploader;