import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectCard.module.css'; // Optional: Include styles for the project cards

const ProjectCard = ({ url, fallbackImage, title }) => {
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Open Graph metadata
        const fetchMetaData = async () => {
            try {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
                const response = await axios.get(proxyUrl);
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.data.contents, 'text/html');
                const ogImage = doc.querySelector('meta[property="og:image"]')?.content;
                setThumbnail(ogImage || fallbackImage || '');
            } catch (error) {
                console.error('Error fetching metadata:', error);
                setThumbnail(fallbackImage || '');
            } finally {
                setLoading(false);
            }
        };

        fetchMetaData();
    }, [url, fallbackImage]);

    return (
        <div className={styles.projectCard}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <img
                        src={thumbnail}
                        alt={`${title || 'Project'} thumbnail`}
                        className={styles.thumbnail}
                    />
                    <div className={styles.title}>{title || 'Project'}</div>
                </a>
            )}
        </div>
    );
};

export default ProjectCard;
