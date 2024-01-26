import React, { useEffect, useState } from "react";

import "./movie-grid.scss";

import MovieCard from "../movie-card/MovieCard";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import tmdbApi, { category, movieType } from "../../api/tmdbApi";
import { OutLineButton } from "../button/Button";

const MovieGrid = (props) => {
    const [items, setItems] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(0);

    const { keyword } = useParams();

    useEffect(() => {
        const getList = async () => {
            let response = null;

            if (keyword === undefined) {
                const params = {};

                switch (props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(movieType.upcoming, {
                            params,
                        });
                        break;
                    default:
                        response = await tmdbApi.getMoviesList(movieType.popular, {
                            params,
                        });
                }
            } else {
                const parmas = {
                    query: keyword,
                };
                response = await tmdbApi.search(props.category, { parmas });
            }
            setItems(response.results);
            setTotalPage(response.total_pages);
        };
        getList();
    }, [props.category, keyword]);

    const loadMore = async () => {
        let response = null;

        if (keyword === undefined) {
            const params = {
                page: page + 1,
            };

            switch (props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, {
                        params,
                    });
                    break;
                default:
                    response = await tmdbApi.getMoviesList(movieType.popular, {
                        params,
                    });
            }
        } else {
            const parmas = {
                page: page + 1,
                query: keyword,
            };
            response = await tmdbApi.search(props.category, { parmas });
        }
        setItems([...items, ...response.results]);
        setPage(page + 1);
    };

    return (
        <>
            <div className="movie-grid">
                {items.map((item, i) => (
                    <MovieCard key={i} category={props.category} item={item} />
                ))}
            </div>
            {page < totalPage ? (
                <div className="movie-grid__loadmore">
                    <OutLineButton className="small" onClick={loadMore}>
                        Load more
                    </OutLineButton>
                </div>
            ) : null}
        </>
    );
};

export default MovieGrid;
