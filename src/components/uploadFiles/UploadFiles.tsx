import React, {ChangeEvent, useCallback, useRef, useState} from "react";
import styles from "./UploadFiles.module.sass";
import {HorizontalScroll} from "../horizontalScroll/HorizontalScroll";
import {RiDeleteBin5Fill} from "react-icons/ri"

interface UploadFilesProps {

}

const UploadFiles = React.memo<UploadFilesProps>(() => {
    const uploadRef = useRef(null);
    const [files, setUpLoadedFiles] = useState<FileList>(null);
    const [hoveredEl, setHoveredEl] = useState<string>(null);

    const createFileList = (files: Array<File>): FileList => {
        return {
            length: files.length,
            item: (index: number) => files[index],
            * [Symbol.iterator]() {
                for (let i = 0; i < files.length; i++) {
                    yield files[i];
                }
            },
            ...files,
        };
    };

    const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (files) {
            const prevFiles = Array.from(files);
            const newFiles = Array.from(e.target.files);

            const newArrOfFiles = prevFiles.concat(newFiles);
            const newFileLIst = createFileList(newArrOfFiles);

            setUpLoadedFiles(newFileLIst);
            // setFiles(newFileLIst);
        } else {
            setUpLoadedFiles(e.target.files);
            // setFiles(e.target.files);
        }
    }, [files])

    const clickHandle = useCallback(() => {
        if (uploadRef) {
            uploadRef.current.click();
        }
    }, [])

    const createFilePreview = (file: File): JSX.Element => {
        const url = URL.createObjectURL(file);
        if (file.type === 'application/pdf') {
            return <embed src={url} width="150" height="100" />
        } else {
            return <img alt={'img-preview'} src={url} />
        }
    }

    const onMouseOverHandle = useCallback((name: string) => {
        setHoveredEl(name);
    }, [])

    const onMouseLeaveHandle = useCallback(() => {
        setHoveredEl(null);
    }, [])

    const onDeleteClickHandler = useCallback((name: string) => {
        const filesArray = Array.from(files);
        const result: File[] = [];

        for (let i = 0; i < filesArray.length; i++) {
            let currentFile = filesArray[i]
            if (currentFile.name !== name) {
                result.push(currentFile);
            }
        }

        setUpLoadedFiles(createFileList(result));
        // setFiles(createFileList(result));
    }, [files])

    const renderUploadFilePreview = (file: File): JSX.Element => {
        return (
            <div
                key={file.name}
                className={styles.file_item}
                onMouseOver={() => onMouseOverHandle(file.name)}
                onMouseLeave={onMouseLeaveHandle}
            >
                <div className={styles.image_container}>
                    {createFilePreview(file)}
                </div>
                <div className={styles.image_name}>
                    {file.name}
                </div>
                {hoveredEl === file.name && (
                    <div
                        className={styles.delete_button}
                        onClick={() => onDeleteClickHandler(file.name)}
                    >
                        <RiDeleteBin5Fill size={24}/>
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            <div
                className={styles.upload_form}
                onClick={clickHandle}
            >
                <span className={styles.upload_text}>
                    <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
                        <g fill="currentColor" fillRule="evenodd">
                            <path d="M11.208 9.32L9.29 11.253a1 1 0 000 1.409.982.982 0 001.397 0l1.29-1.301 1.336 1.347a.982.982 0 001.397.001 1.002 1.002 0 00.001-1.408l-1.965-1.98a1.08 1.08 0 00-1.538-.001z"></path>
                            <path d="M11 10.007l.001 9.986c0 .557.448 1.008 1 1.007.553 0 1-.45 1-1.007L13 10.006C13 9.451 12.552 9 12 9s-1.001.451-1 1.007z"></path>
                            <path d="M7.938 5.481a4.8 4.8 0 00-.777-.063C4.356 5.419 2 7.62 2 10.499 2 13.408 4.385 16 7.1 16h2.881v-1.993H7.1c-1.657 0-3.115-1.663-3.115-3.508 0-1.778 1.469-3.087 3.104-3.087h.012c.389 0 .686.051.97.15l.17.063c.605.248.875-.246.875-.246l.15-.267c.73-1.347 2.201-2.096 3.716-2.119a4.14 4.14 0 014.069 3.644l.046.34s.071.525.665.525c.013 0 .012.005.023.005h.254c1.136 0 1.976.959 1.976 2.158 0 1.207-.987 2.342-2.07 2.342h-3.964V16h3.964C20.105 16 22 13.955 22 11.665c0-1.999-1.312-3.663-3.138-4.074-.707-2.707-3.053-4.552-5.886-4.591-1.975.021-3.901.901-5.038 2.481z"></path>
                        </g>
                    </svg>
                    <div className={styles.push}>нажмите для выбора файлов</div>
                </span>
            </div>
            <input
                className={styles.hidden}
                type="file"
                ref={uploadRef}
                onChange={handleOnChange}
                multiple
                accept="image/*,.png,.jpg,.gif,.pdf,.web"
            />
            {files && files.length ? (
                    <div className={styles.uploaded_files}>
                        <HorizontalScroll className={styles.slider}>
                            {Array.from(files).map((file) => renderUploadFilePreview(file))}
                        </HorizontalScroll>
                    </div>
                ) : null}
        </>
    )
})

export default UploadFiles