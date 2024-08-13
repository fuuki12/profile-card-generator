"use client";

import { useState } from "react";
import { User } from "../types";

const useGitHubUserData = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData({
        login: data.login,
        id: data.id,
        node_id: data.node_id,
        avatar_url: data.avatar_url,
        gravatar_id: data.gravatar_id,
        url: data.url,
        html_url: data.html_url,
        followers_url: data.followers_url,
        following_url: data.following_url,
        gists_url: data.gists_url,
        starred_url: data.starred_url,
        subscriptions_url: data.subscriptions_url,
        organizations_url: data.organizations_url,
        repos_url: data.repos_url,
        events_url: data.events_url,
        received_events_url: data.received_events_url,
        type: data.type,
        site_admin: data.site_admin,
        name: data.name,
        company: data.company,
        blog: data.blog,
        location: data.location,
        email: data.email,
        hireable: data.hireable,
        bio: data.bio,
        twitter_username: data.twitter_username,
        public_repos: data.public_repos,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following,
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
    } catch (error) {
      setError("不正なレスポンスです");
    }

    setIsLoading(false);
  };

  return { fetchUserData, userData, isLoading, error };
};

export default useGitHubUserData;
