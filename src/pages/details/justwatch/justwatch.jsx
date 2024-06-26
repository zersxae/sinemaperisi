import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const DetailsPage = () => {
    const { mediaType, id } = useParams();
    const [watchProviders, setWatchProviders] = useState(null);
    const [error, setError] = useState(null);
    const apikey = "095262b2872d2235d6da623056c10cd9";

      const determineMediaType = () => {
        // mediaType parametresine göre içeriğin türünü belirle
        if (mediaType === "movie") {
            return "movie";
        } else if (mediaType === "tv") {
            return "tv";
        }
        // Varsayılan olarak film olarak dön
        return "movie";
    };

    useEffect(() => {
        const fetchWatchProviders = async () => {
            try {
                const mediaType = determineMediaType();
                const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/watch/providers?api_key=${apikey}`);
                if (!response.ok) {
                    throw new Error("Watch providers could not be fetched.");
                }
                const data = await response.json();
                setWatchProviders(data);
            } catch (error) {
                console.error("Error fetching watch providers:", error);
                setError(error.message);
            }
        };

        if (mediaType && id) {
            fetchWatchProviders();
        }
    }, [mediaType, id]);

    const handleClick = (link) => {
        window.open(link, "_blank");
    };

    return (
        <div className="detailsPage">
            <ContentWrapper>
                {watchProviders &&
                    watchProviders.results &&
                    watchProviders.results.TR &&
                    watchProviders.results.TR.flatrate && 
                    watchProviders.results.TR.flatrate.length > 0 && (
                        <div className="watchProviders">
                            <div className="sectionHeading">İzleme Seçenekleri</div>
                            {error && <div className="error">{error}</div>}
                            <div className="providerList">
                                {watchProviders.results.TR.flatrate.map((provider) => (
                                    <button
                                        key={provider.provider_id}
                                        className="provider rent"
                                        onClick={() => handleClick(provider.link)}
                                    >
                                        <img
                                            src={`https://www.themoviedb.org/t/p/original${provider.logo_path}`}
                                            className="logo"
                                            alt={provider.provider_name}
                                        />
                                        <div className="providerName">{provider.provider_name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
            </ContentWrapper>
        </div>
    );
};

export default DetailsPage;
